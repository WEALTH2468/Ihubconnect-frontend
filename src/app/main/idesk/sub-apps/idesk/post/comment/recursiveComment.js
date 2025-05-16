import React from 'react';
import ListItem from '@mui/material/ListItem';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import TimeAgo from 'app/configs/TimeAgo';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import addBackendProtocol from 'app/theme-layouts/shared-components/addBackendProtocol';
import { Tooltip } from '@mui/material';

const RecursiveComment = ({
  comment,
  allComments,
  onReplySubmit,
  replyingTo,
  handleReply,
  replyText,
  setReplyText,
  user,
  handleDelete,
}) => {
  // Find children comments
  const childComments = allComments.filter((c) => c.parentId === comment._id);

  // Adjust avatar size based on whether the comment is nested
  const avatarSize = comment.parentId ? 20 : 30;

  return (
    <>
      <div className="comment-item border border-gray-200 rounded-md gap-5 mb-[10px] relative pl-5">
        {/* Main comment block */}
        <ListItem className="px-0 -mx-8">
          <Avatar
            alt={comment.user.name}
            src={addBackendProtocol(comment.user.avatar)}
            className="mx-8"
            sx={{ width: avatarSize, height: avatarSize }}
          />
          <ListItemText
            className="px-4"
            primary={
              <div className="flex items-center space-x-8">
                <Typography className="font-normal">
                  {comment.user.name}
                </Typography>
                <Typography
                  variant="caption"
                  className="text-gray-500 ml-[15px] font-small text-[11px]"
                >
                  • <TimeAgo date={comment.time} />
                </Typography>
              </div>
            }
            secondary={comment.text}
          />
        </ListItem>

        {/* Buttons */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button
              endIcon={
                <FuseSvgIcon size={14}>heroicons-outline:thumb-up</FuseSvgIcon>
              }
              disabled
            />
            <Button
              endIcon={
                <FuseSvgIcon size={14}>
                  heroicons-outline:thumb-down
                </FuseSvgIcon>
              }
              disabled
            />
            <Tooltip title="Reply Comment" arrow>
              <Button
                endIcon={
                  <FuseSvgIcon size={14}>heroicons-outline:reply</FuseSvgIcon>
                }
                onClick={() => handleReply(comment._id)}
              />
            </Tooltip>
          </div>
          {user._id === comment.userId && (
            <Button
              className="text-red mr-11"
              endIcon={
                <FuseSvgIcon size={14}>heroicons-outline:trash</FuseSvgIcon>
              }
              onClick={() => handleDelete(comment._id)}
            >
              Delete
            </Button>
          )}
        </div>

        {/* Reply Input stays inside */}
        {replyingTo === comment._id && (
          <Box className=" flex my-8">
            <TextField
              fullWidth
              placeholder="Write a reply..."
              variant="outlined"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full"
            />
            <Button
              variant="contained"
              color="secondary"
              size="large"
              className="mx-8"
              onClick={() => onReplySubmit(comment._id, replyText)}
              disabled={!replyText.trim()}
            >
              Reply
            </Button>
          </Box>
        )}
      </div>

      {/* Replies rendered outside the parent block */}
      {childComments.map((childComment) => (
        <div key={childComment._id} className="ml-10">
          <RecursiveComment
            comment={childComment}
            allComments={allComments}
            onReplySubmit={onReplySubmit}
            replyingTo={replyingTo}
            handleReply={handleReply}
            replyText={replyText}
            setReplyText={setReplyText}
            user={user}
            handleDelete={handleDelete}
          />
        </div>
      ))}
    </>
  );
};

export default RecursiveComment;
