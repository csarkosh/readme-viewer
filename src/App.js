import React from 'react';
import {AppBar, Grid, IconButton, Tooltip, Typography} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { FaGithub } from 'react-icons/fa';
import ResumeIcon from "./components/ResumeIcon";
import ResumeModal from './components/ResumeModal'
import ProjectCard from "./components/ProjectCard";
import axios from 'axios'

const appBarHeight = '50px'
const mobileTheaterHeight = '170px'
const mobileThreshold = '600px'
const theaterHeight = '300px'

const styles = () => ({
    appBar: {
        height: appBarHeight,
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
        marginTop: 8,
        overflowY: 'auto',
        height: `calc(100vh - ${appBarHeight})`,
    },
    forkMeBanner: {
        position: 'fixed',
        zIndex: 1250,
    },
    theater: {
        backgroundColor: 'black',
        height: `calc(100vh - ${theaterHeight})`,
        position: 'fixed',
        width: '100%',
        zIndex: 5,
        [`@media (min-width: ${mobileThreshold})`]: {
            height: `calc(100vh - ${mobileTheaterHeight})`
        }
    },
    theaterReposContainer: {
        height: '100vw',
        width: 250,
        overflowX: 'auto',
        marginTop: `calc(100vh - ${theaterHeight})`,
        transform: 'rotate(-90deg)',
        transformOrigin: 'right top',
        zIndex: -1,
        '& > div': {
            transform: 'rotate(90deg)',
            transformOrigin: 'right top',
        },
        [`@media (min-width: ${mobileThreshold})`]: {
            marginTop: `calc(100vh - ${mobileTheaterHeight})`
        }
    },
});

class App extends React.Component {
    state = {
        hasReposError: false,
        resumeOpen: false,
        repos: null,
        selectedRepo: null,
    }

    componentDidMount() {
        axios.get('/data/repos.json')
            .then(({ data }) => this.setState({ repos: data.sort((a, b) =>b.isFork ? -1 : 1) }))
            .catch(() => this.setState({ hasReposError: true }))
    }

    handleResumeClose = () => this.setState({ resumeOpen: false })
    handleResumeOpen = () => this.setState({ resumeOpen: true })

    handleRepoOnClick = name => this.setState({ selectedRepo: this.state.selectedRepo === name ? null : name })

    render() {
        const { classes } = this.props
        return (
            <div style={{ marginTop: -2}}>
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
                                <Tooltip title="Open my Resume">
                                    <IconButton color="inherit" href="#" aria-label="Resume" style={{marginTop: 2}} onClick={this.handleResumeOpen}>
                                        <ResumeIcon/>
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                            <Grid item>
                                <Tooltip title="Go to my GitHub">
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
                    <React.Fragment>
                        {this.state.selectedRepo && <div className={classes.theater} /> }
                        {this.state.selectedRepo === null &&
                            <Grid
                                className={classes.reposContainer}
                                container
                                direction="column"
                                item
                                alignItems="center"
                                spacing={2}
                                wrap={this.state.selectedRepo ? undefined : 'nowrap'}
                            >
                                {this.state.repos.map(({description, name, parent, url}) => (
                                    <Grid key={name} item>
                                        <ProjectCard
                                            description={description}
                                            expanded={name === this.state.selectedRepo}
                                            onClick={this.handleRepoOnClick}
                                            parent={!parent ? undefined : {name: parent.nameWithOwner, url: parent.url}}
                                            readmeSrc={`/docs/readmes/${name}.html`}
                                            repoName={name}
                                            repoUrl={url}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        }
                    </React.Fragment>
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
