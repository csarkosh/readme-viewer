import React, { Component } from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    }
});

class ProjectCard extends Component {
    render() {
        const { classes, description, title } = this.props;
        return (
            <Card className={classes.card}>
                <CardContent>
                    <Typography variant="headline" component="h2">
                        {title}
                    </Typography>
                    <Typography component="p">
                        {description}
                    </Typography>
                </CardContent>
            </Card>
        );
    }
}

export default withStyles(styles)(ProjectCard);
