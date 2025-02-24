import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/store/userSlice';
import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';
import { Star } from '@mui/icons-material';

const ScoreCardApp = ({ setSelectedTab }) => {
    const user = useSelector(selectUser);
    const [hovered, setHovered] = useState(null);
    const [visible, setVisible] = useState(false);
    const [progressValues, setProgressValues] = useState({ tasks: 0, collaboration: 0, performance: 0 });
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
                    setProgressValues({
                        tasks: 35,
                        collaboration: 27,
                        performance: 35,
                    });
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
        tasks: {
            total: 35,
            details: {
                "Completed": 10,
                "Created": 15,
                "Sprints Done": 10
            }
        },
        collaboration: {
            total: 27,
            details: {
                "Posts": 10,
                "Comments": 10,
                "Likes": 7
            }
        },
        performance: {
            total: 35,
            details: {
                "Punctuality": 5,
                "Team Work": 10,
                "Chats Made": 20
            }
        }
    };

    const totalPoints = Object.values(scores).reduce((acc, item) => acc + item.total, 0);
    const totalStars = Math.floor(totalPoints / 20);

    return (
        <Card sx={{ maxWidth: 300, mx: 'auto', p: 2, boxShadow: 3, borderRadius: 5, border: '0px' }} ref={ref}>
            <CardContent>
                <Typography variant="h5" fontWeight="bold" textAlign="start" gutterBottom sx={{ fontSize: 16, paddingBottom: 2 }}>
                    KPI
                </Typography>

                {Object.entries(scores).map(([key, value]) => (
                    <Box key={key} 
                        onMouseEnter={() => setHovered(key)}
                        onMouseLeave={() => setHovered(null)}
                        sx={{ 
                            mb: 1,
                            p: 1, 
                            borderRadius: 2, 
                            backgroundColor: hovered === key ? 'rgb(241, 244, 249)' : 'transparent',
                            transition: 'background-color 0.3s ease-in-out',
                            cursor: 'pointer'
                        }}>
                        <Typography variant="body2" fontWeight="medium" gutterBottom sx={{ fontSize: 13 }}>
                            {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                        </Typography>
                        <LinearProgress 
                            variant="determinate" 
                            value={visible ? (progressValues[key] / 50) * 100 : 0} 
                            sx={{ height: 6, borderRadius: 3, mb: 1, backgroundColor: '#d0e2ff', '& .MuiLinearProgress-bar': { backgroundColor: '#007bff', transition: 'width 1.5s ease-in-out' } }} 
                        />
                        <Typography variant="body2" fontWeight="bold" textAlign="end" fontSize={12} sx={{ color: 'black' }}>
                            {value.total} Points
                        </Typography>
                        {hovered === key && (
                            <Box sx={{ m: 1, p: 1, borderRadius: 2, backgroundColor: 'white', boxShadow: 1 }}>
                            {Object.entries(value.details).map(([subKey, subValue]) => (
                                <Box key={subKey} sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', alignItems: 'center', fontFamily: 'Roboto, sans-serif', borderBottom: '1px solid #f1f4f9', py: 1 }}>
                                    <Typography variant="body2" fontWeight="medium" sx={{ fontSize: 12 }}>
                                        {subKey}:
                                    </Typography>
                                    <Typography variant="body2" fontWeight="bold" sx={{ fontSize: 12, color: 'black' }}>
                                        {subValue} Points
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                        )}
                    </Box>
                ))}

                <Typography variant="body1" fontWeight="bold" textAlign="center" mt={1} sx={{ fontSize: 14 }}>
                    Score Points: {totalPoints}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                    {Array.from({ length: 5 }, (_, index) => (
                        <Star key={index} sx={{ color: index < totalStars ? 'orange' : 'gray', fontSize: 18 }} />
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
};

export default ScoreCardApp;
