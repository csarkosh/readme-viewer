import React from 'react';
import {AppBar, Grid, IconButton, Tooltip, Typography} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { FaGithub } from 'react-icons/fa';
import ResumeModal from './components/ResumeModal'
import axios from 'axios'
import Project from "./components/ProjectButton";


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
        marginTop: 8,
        overflowY: 'auto',
        height: `calc(100vh - 50px)`,
    },
    forkMeBanner: {
        position: 'fixed',
        zIndex: 1250,
    },
    theater2: {
        backgroundColor: '#f2f5fa',
        paddingBottom: 16,
        '& > div': {
            backgroundColor: 'black',
            boxShadow: '0 2px 2px',
        },
        '& > div > div': {
            height: 'calc(50vh - 50px)',
            margin: '0 auto',
            overflow: 'auto',
            width: 'calc(100vw - 32px)',
            '-webkit-overflow-scrolling': 'touch',
        },
        '& iframe': {
            border: 'none',
            backgroundColor: 'white',
            height: '100%',
            width: '100%',
        }
    },
    theaterReposContainer: {
        height: 'calc(50vh - 50px)',
        overflowX: 'hidden',
        overflowY: 'auto',
        paddingTop: 8,
        '& button': {
            margin: 8,
            verticalAlign: 'top'
        },
        '& > div': {
            flexWrap: 'wrap',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            margin: '0 auto',
            maxWidth: 1400,
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

    handleRepoOnClick = id => id !== this.state.selectedRepo && this.setState({ selectedRepo: id })

    render() {
        const { classes } = this.props
        return (
            <div style={{ marginTop: -4}}>
                <AppBar className={classes.appBar} position="sticky">
                    <Grid
                        className={classes.appBarGridContainer}
                        container
                        justify="space-between"
                        alignContent="center"
                        wrap="nowrap"
                    >
                        <Grid item>
                            <Typography className={classes.appBarLogo} variant="h5">readme-viewer.csarko.sh</Typography>
                        </Grid>
                        <Grid className={classes.iconToolbar} container item justify="flex-end">
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

                {this.state.selectedRepo &&
                    <div className={classes.theater2}>
                        <div>
                            <div>
                                {this.state.repoIds.map(id => {
                                    const { name } = this.state.repoMap[id]
                                    const src = `/docs/readmes/${name}.html`
                                    const isSelected = id === this.state.selectedRepo
                                    return (
                                        <iframe
                                            src={src}
                                            title="readme theater"
                                            key={name}
                                            style={{
                                                display: isSelected ? 'block' : 'none'
                                            }}
                                        />
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                }

                { this.state.hasReposError &&
                    <Typography className={classes.bodyText} variant="h3">Oops... An error has occurred fetching my repo data</Typography>
                }


                { this.state.selectedRepo !== null &&
                    <div className={classes.theaterReposContainer}>
                        <div>
                            {this.state.repoIds.map(id => {
                                const {description, name, parent, url} = this.state.repoMap[id]
                                return (
                                    <div key={name}>
                                        <Project
                                            description={description}
                                            name={name}
                                            onClick={this.handleRepoOnClick}
                                            parent={!parent ? undefined : {name: parent.nameWithOwner, url: parent.url}}
                                            selected={this.state.selectedRepo === name}
                                            url={url}
                                        />
                                    </div>
                                )
                            })}
                            <div style={{ opacity: 0, height: 64, width: '100vw' }}/>
                        </div>
                    </div>
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
