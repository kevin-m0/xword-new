"use client"
import React from 'react';
import { useOrganization, useUser } from '@clerk/nextjs';
import { IDocument } from '~/types/docs.types';
import CollabEditorComponent from './collab-editor/CollabEditorComponent';

const WriterXComponent = ({ doc }: { doc: IDocument }) => {
    const { user } = useUser();
    const { memberships } = useOrganization({
        memberships: {
            infinite: true
        }
    });

    // console.log(memberships?.data);

    const userExists = memberships?.data?.find((mem) => mem.publicUserData.userId === user?.id);

    // console.log(userExists);

    return (
        <>
            <CollabEditorComponent
                id={doc?.id!}
                title={doc.title}
                docId={doc.docId!}
                edit={userExists?.role === 'org:admin' || userExists?.role === 'org:editor'}
            />
        </>
    );
};

export default WriterXComponent;
