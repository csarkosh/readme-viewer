import React from 'react';
import {AppBar, Grid, IconButton, Tooltip, Typography} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { FaGithub } from 'react-icons/fa';
import ResumeIcon from "./components/ResumeIcon";
import ResumeModal from './components/ResumeModal'
import ProjectCard from "./components/ProjectCard";
import axios from 'axios'

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
        margin: '48px auto 0',
        textAlign: 'center',
        width: '75vw',
        wordBreak: 'break-word'
    },
    iconToolbar: {
        '@media (max-width: 200px)': {
            display: 'none',
        }
    },
    reposContainer: {
        marginTop: 8
    },
    forkMeBanner: {
        position: 'absolute',
        zIndex: 2140,
    },
});

class App extends React.Component {
    state = {
        hasReposError: false,
        resumeOpen: false,
        repos: null,
    }

    componentDidMount() {
        axios.get('/data/repos.json')
            .then(({ data }) => this.setState({ repos: data.sort(a => a.isFork ? 1 : -1) }))
            .catch(() => this.setState({ hasReposError: true }))
    }

    handleResumeClose = () => this.setState({ resumeOpen: false })
    handleResumeOpen = () => this.setState({ resumeOpen: true })

    render() {
        const { classes } = this.props
        return (
            <div>
                <a href="https://github.com/csarkosh/csarko.sh">
                    <img width="149" height="149"
                        src="https://github.blog/wp-content/uploads/2008/12/forkme_left_red_aa0000.png?resize=149%2C149"
                        className={`attachment-full size-full ${classes.forkMeBanner}`}
                        alt="Fork me on GitHub"
                        data-recalc-dims="1"
                    />
                </a>
                <AppBar className={classes.appBar} position="sticky">
                    <Grid
                        className={classes.appBarGridContainer}
                        container
                        justify="space-between"
                        alignContent="center"
                        wrap="nowrap"
                    >
                        <Grid item>
                            <Typography className={classes.appBarLogo} variant="h5">csarko.sh</Typography>
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

                { this.state.hasReposError &&
                    <Typography className={classes.bodyText} variant="h3">Oops... An error has occurred fetching my repo data</Typography>
                }

                { this.state.repos &&
                    <Grid className={classes.reposContainer} container justify="center" spacing={2}>
                        {this.state.repos.map(({ description, name, parent, url }) => (
                            <Grid key={name} item>
                                <ProjectCard
                                    description={description}
                                    repoName={name}
                                    repoUrl={url}
                                    parent={!parent ? undefined : { name: parent.nameWithOwner, url: parent.url }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                }

                <ResumeModal
                    onClose={this.handleResumeClose}
                    open={this.state.resumeOpen}
                />

            </div>
        )
    }
}

export default withStyles(styles)(App);
