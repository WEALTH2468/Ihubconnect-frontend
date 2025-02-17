import { useDispatch, useSelector } from 'react-redux';
import FuseSearch from '@fuse/core/FuseSearch';
import { selectFlatNavigation } from 'app/store/fuse/navigationSlice';
import {
    getFoldersAndUsers,
    selectAllFoldersAndFiles,
} from 'src/app/main/file-manager/store/documentSlice';
import { useEffect } from 'react';

function NavigationSearch(props) {
    const dispatch = useDispatch();
    const { variant, className } = props;
    // const navigation = useSelector(selectFlatNavigation);
    let navigation;

    const AllFoldersAndFiles = useSelector(selectAllFoldersAndFiles);

    if (AllFoldersAndFiles != undefined) {
        navigation = AllFoldersAndFiles?.reduce((acc, doc, docIndex, arr) => {
            if (doc.type != 'folder') {
                const Parents = arr.filter((item) =>
                    doc.folders.some((parentId) => parentId == item._id)
                );
                if (Parents.length == 0) {
                    acc?.push({
                        id: doc._id,
                        title: `${doc.name}`,
                        translate: '',
                        type: doc.type,
                        icon: 'heroicons-outline:folder-open',
                        url: `/file-manager`,
                    });
                } else {
                    Parents.forEach((parent) => {
                        acc?.push({
                            id: parent._id,
                            title: `${parent.name}/${doc.name}`,
                            translate: '',
                            type: parent.type,
                            icon: 'heroicons-outline:folder-open',
                            url: `/file-manager/${parent._id}`,
                        });
                    });
                }
            } else {
                acc?.push({
                    id: doc._id,
                    title: `${doc.name}`,
                    translate: '',
                    type: doc.type,
                    icon: 'heroicons-outline:folder-open',
                    url: `/file-manager/${doc._id}`,
                });
            }
            return acc;
        }, []);
    }

    return (
        <FuseSearch
            className={className}
            variant={variant}
            navigation={navigation}
        />
    );
}

export default NavigationSearch;
