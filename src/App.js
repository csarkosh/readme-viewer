import React from 'react';
import {AppBar, Grid, IconButton, Tooltip, Typography} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { FaGithub } from 'react-icons/fa';
import ResumeIcon from "./components/ResumeIcon";
import ResumeModal from './components/ResumeModal'
import ProjectCard from "./components/ProjectCard";
import axios from 'axios'

const appBarHeight = '50px'
const theaterHeight = '400px'

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
        '& iframe': {
            backgroundColor: 'white',
            border: 'none',
            height: `calc(100vh - ${theaterHeight})`,
            width: '70vw'
        },
        '& > div': {
            margin: '0 auto',
            width: 'fit-content',
        },
    },
    theaterReposContainer: {
        alignItems: 'flex-start',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        height: `calc(${theaterHeight} - ${appBarHeight})`,
        overflowY: 'auto',
        width: '100vw',
        marginTop: `calc(100vh - ${theaterHeight})`,
        paddingTop: 8,
        '& > button': {
            margin: 8
        },
    },
});

class App extends React.Component {
    state = {
        hasReposError: false,
        resumeOpen: false,
        repoIds: null,
        repoMap: null,
        selectedRepo: null,
    }

    componentDidMount() {
        axios.get('/data/repos.json')
            .then(({ data }) => {
                const repos = data.sort((a, b) =>b.isFork ? -1 : 1)
                const repoIds = repos.map(repo => repo.name)
                const repoMap = {}
                repos.forEach(repo => repoMap[repo.name] = repo)
                this.setState({ selectedRepo: repos[0].name, repoMap, repoIds })
            })
            .catch(() => this.setState({ hasReposError: true }))
    }

    handleResumeClose = () => this.setState({ resumeOpen: false })
    handleResumeOpen = () => this.setState({ resumeOpen: true })

    handleRepoOnClick = name => name !== this.state.selectedRepo && this.setState({ selectedRepo: name })

    render() {
        const { classes } = this.props
        return (
            <div style={{ marginTop: -4}}>
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

                <React.Fragment>
                    { this.state.selectedRepo && (
                        <div className={classes.theater}>
                            <div>
                                <iframe title="readme theater" src={`/docs/readmes/${this.state.repoMap[this.state.selectedRepo].name}.html`} />
                            </div>
                        </div>
                    )}
                    { this.state.selectedRepo !== null &&
                        <div className={classes.theaterReposContainer}>
                            {this.state.repoIds.map(id => {
                                const {description, name, parent, url} = this.state.repoMap[id]
                                return (
                                    <ProjectCard
                                        key={name}
                                        description={description}
                                        expanded={name === this.state.selectedRepo}
                                        onClick={this.handleRepoOnClick}
                                        parent={!parent ? undefined : {name: parent.nameWithOwner, url: parent.url}}
                                        readmeSrc={`/docs/readmes/${name}.html`}
                                        repoName={name}
                                        repoUrl={url}
                                        selected={this.state.selectedRepo === name}
                                    />
                                )
                            })}
                        </div>
                    }
                </React.Fragment>


                <ResumeModal
                    onClose={this.handleResumeClose}
                    open={this.state.resumeOpen}
                />

            </div>
        )
    }
}

export default withStyles(styles)(App);
