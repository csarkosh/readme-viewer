import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { AppBar as MUIAppBar, Toolbar, Typography } from '@material-ui/core';

const styles = {
    root: {
        flexGrow: 1,
    },
};

class AppBar extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <MUIAppBar position="static" color="default">
                    <Toolbar>
                        <Typography variant="title" color="inherit">
                            csarko.sh
                        </Typography>
                    </Toolbar>
                </MUIAppBar>
            </div>
        );
    }
}

export default withStyles(styles)(AppBar);
