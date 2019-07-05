import React from 'react';
import {AppBar, Grid, IconButton, Modal, Paper, Tooltip, Typography} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { FaGithub } from 'react-icons/fa';
import ResumeIcon from "./ResumeIcon";

const styles = () => ({
    appBar: {
        height: 50,
    },
    appBarLogo: {
        margin: '8px 0 0 8px',
    },
    appBarGridContainer: {
        height: '100%',
    },
    bodyText: {
        marginTop: 48,
        textAlign: 'center',
        wordBreak: 'break-word'
    },
    modalPaper: {
        height: '65%',
        margin: '56px auto 0',
        maxWidth: 800,
        padding: 24,
    },
    iconToolbar: {
        '@media (max-width: 200px)': {
            display: 'none',
        }
    }
});

class App extends React.Component {
    state = {
        resumeOpen: false
    }

    handleResumeClose = () => this.setState({ resumeOpen: false })
    handleResumeOpen = () => this.setState({ resumeOpen: true })

    render() {
        const { classes } = this.props
        return (
            <div>
                <AppBar className={classes.appBar} position="sticky">
                    <Grid className={classes.appBarGridContainer} container justify="space-between" alignContent="center"
                          wrap="nowrap">
                        <Grid item>
                            <Typography className={classes.appBarLogo} variant="h6">csarko.sh</Typography>
                        </Grid>
                        <Grid className={classes.iconToolbar} container item justify="flex-end">
                            <Grid item>
                                <Tooltip title="My Resume">
                                    <IconButton color="inherit" href="#" aria-label="Resume" style={{marginTop: 2}} onClick={this.handleResumeOpen}>
                                        <ResumeIcon/>
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                            <Grid item>
                                <Tooltip title="My GitHub">
                                    <IconButton color="inherit" aria-label="GitHub" href="https://github.com/csarkosh">
                                        <FaGithub/>
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </Grid>
                </AppBar>
                <Typography className={classes.bodyText} variant="h1">Coming Soon</Typography>
                <Modal
                    aria-label="My Resume Modal"
                    onClose={this.handleResumeClose}
                    onEscapeKeyDown={this.handleResumeClose}
                    open={this.state.resumeOpen}
                >
                    <Paper className={classes.modalPaper}>
                        <iframe
                            title="My Resume"
                            height="100%"
                            width="100%"
                            src="https://s3-us-west-2.amazonaws.com/csarko.sh/CyrusSarkosh.resume.pdf"
                        />
                    </Paper>
                </Modal>
            </div>
        )
    }
}

export default withStyles(styles)(App);
