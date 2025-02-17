import FusePageCarded from '@fuse/core/FusePageCarded';
import { useEffect, useState } from 'react';
import ReportAppHeader from './ReportAppHeader';

function ReportApp(props) {
    useEffect(() => {
        const originalTitle = document.title;
        document.title = 'Ihub Connect - Report';

        return () => {
            document.title = originalTitle; // Reset on unmount
        };
    }, []);
    const [open, setOpen] = useState(false);

    return (
        <FusePageCarded
            header={<ReportAppHeader setOpen={setOpen} />}
            scroll="page"
        />
    );
}

export default ReportApp;
