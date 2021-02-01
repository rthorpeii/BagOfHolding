import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Typography } from '@material-ui/core';

function Profile() {
    const { user, isAuthenticated } = useAuth0();

    return isAuthenticated && (
        <div>
            <Typography>
                Hello {user.given_name}
            </Typography>
        </div>);
}

export default Profile;