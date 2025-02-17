import { Box, Button } from '@mui/material';
import React from 'react';

function Detail({ children }) {
  return (
    <div className="p-32">
      <Box className="w-full rounded-16 mb-24 border relative">
        {React.Children.map(children, (child) => {
          if (typeof child.type === 'string') {
            return child;
          }
          const newChild = React.cloneElement(child, {});
          return newChild;
        })}
      </Box>
    </div>
  );
}

function DetailHeader({ children }) {
  return (
    <div className="relative">
      <div className="h-auto flex flex-row justify-between w-full p-24">
        {children}
      </div>
      <hr className="w-full !border-[#e8e8e8] absolute bottom-0 left-0 right-0" />
    </div>
  );
}

function DetailBody({ children, className }) {
  return <div className={`p-24 ${className}`}>{children}</div>;
}

function Info({ label, value, actionType }) {
  return (
    <div className="flex space-x-64">
      <p
        className="text-lg w-96 overflow-hidden"
        style={{
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </p>
      <input
        className="text-lg w-128"
        type="text"
        value={value}
        onChange={() => {}}
      />
      <button className="bg-transparent text-sm" type="submit">
        {actionType === 'Select' ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.5em"
            height="1.5em"
            viewBox="0 0 12 12"
          >
            <path
              fill="#616161"
              d="M6 8.825c-.2 0-.4-.1-.5-.2l-3.3-3.3c-.3-.3-.3-.8 0-1.1s.8-.3 1.1 0l2.7 2.7l2.7-2.7c.3-.3.8-.3 1.1 0s.3.8 0 1.1l-3.2 3.2q-.3.3-.6.3"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.5em"
            height="1.5em"
            viewBox="0 0 24 24"
          >
            <path
              fill="#616161"
              d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z"
            />
          </svg>
        )}
      </button>
    </div>
  );
}

export default function ContactDetail() {
  return (
    <div className="">
      {/* General Info */}

      <Detail>
        <DetailHeader>
          <div className="flex flex-row gap-16  items-center">
            <div className="bg-gray-800 w-72 h-72 rounded-full">
              <img src="" alt="" />
            </div>
            <div>
              <p>ABC Company</p>
              <p>MD at ABC Company</p>
            </div>
          </div>
          <Button
            className="whitespace-nowrap mx-4"
            variant="contained"
            color="error"
            role="button"
            type="submit"
          >
            Delete
          </Button>
        </DetailHeader>
        <DetailBody className="space-y-16">
          <Info label="Contact Owner" value="Test Owner" actionType="Select" />
          <Info label="First Name" value="Samuel" actionType="Edit" />
          <Info label="Last Name" value="Samuel" actionType="Edit" />
          <Info label="Email" value="info.samuel.com" actionType="Edit" />
          <Info label="Phone Number" value="+234l9993" actionType="Edit" />
          <Info label="Job Title" value="MD" actionType="Edit" />
        </DetailBody>
      </Detail>

      {/* Personal Details */}
      {/* Opportunities */}
      {/* Notes */}
      {/* Attachments */}
      {/* Emails */}
      {/* Quotes */}
    </div>
  );
}
