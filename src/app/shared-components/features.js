import features from './features.json';

export const getNewFeatures = (lastLogin) => {
    if(lastLogin){
        return features.filter(feature => new Date(feature.addedAt) > new Date(lastLogin));
    }else{
        return features
    }
};

