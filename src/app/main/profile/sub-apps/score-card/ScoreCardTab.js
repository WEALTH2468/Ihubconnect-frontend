import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/store/userSlice';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { Star } from '@mui/icons-material';

const ScoreCardApp = ({ setSelectedTab }) => {
    const user = useSelector(selectUser);
    const [visible, setVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        document.title = "Ihub Connect - Score Card";
        if (!user.avatar) setSelectedTab(1);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                }
            },
            { threshold: 0.3 }
        );
        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => observer.disconnect();
    }, []);

    const scores = {
        tasks: 
        { total: 100, 
            done: 70, 
            inProgress: 20, 
            notStarted: 10 },

        performance: 
        { total: 100, 
            punctuality: 80, 
            tasks: 15 },

             communication:
             { total: '-',
                 posts: '-',
                  chats: '-',
                   commentsLikes: '-'
                 },

    };

    const totalPoints = Object.values(scores).reduce((acc, item) => acc + item.total, 0);
    const totalStars = Math.floor(totalPoints / 20);

    const getColor = (key) => {
        if (key === 'done' || key === 'punctuality') return 'green';
        if (key === 'inProgress' ) return '#144caf';
        return '#bdbec0';
    };

    return (
        <Card sx={{ maxWidth: 300, mx: 'auto', pl: 2, pr: 2, boxShadow: 3, borderRadius: 5, border: '0px' }} ref={ref}>
            <CardContent sx={{ pl: 1, pr: 1, pt: 3, }}>
                <Typography variant="h6" fontWeight="bold" sx={{ fontSize: 18, pb: 1 }}>
                    KPI
                </Typography>

                {Object.entries(scores).map(([category, data]) => {
    const isDisabled = category === 'communication';

    const userAchieved = Object.values(data).reduce((acc, value) =>
        typeof value === 'number' ? acc + value : acc, 0
    ) - data.total;

    return (
        <Box
            key={category}
            sx={{
                opacity: isDisabled ? 0.6 : 1,
                pointerEvents: isDisabled ? 'none' : 'auto',
                position: 'relative',
                mb: 2,
            }}
        >

            {/* Category Title with Achieved Score */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 'bold' }}>
                <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: 11 }}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: 10 }}>
                    {userAchieved || "-"} / {data.total}%
                </Typography>
            </Box>

            {/* Progress Bar */}
            <Box sx={{ display: 'flex', height: 7, overflow: 'hidden', mb: 0.5 }}>
                {Object.entries(data).map(([key, value]) =>
                    key !== 'total' ? (
                        <Box key={key} sx={{ backgroundColor: getColor(key), width: `${value}%` }} />
                    ) : null
                )}
            </Box>

            {/* Labels and Values */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 200 }}>
                {Object.entries(data).map(([key, value]) =>
                    key !== 'total' ? (
                        <Box
                            key={key}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                color: getColor(key),
                                fontSize: 10,
                            }}
                        >
                            <Typography variant="caption" sx={{ fontSize: 9, fontWeight: 'semi-bold' }}>
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </Typography>
                            <Typography variant="caption" sx={{ fontSize: 9, fontWeight: 'bold' }}>
                                {value}%
                            </Typography>
                        </Box>
                    ) : null
                )}
            </Box>
        </Box>
    );
})}


            </CardContent>
        </Card>
    );
};

export default ScoreCardApp;
