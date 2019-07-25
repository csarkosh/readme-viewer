import React from 'react'
import {ExpansionPanel, ExpansionPanelSummary, Grid, Typography, withStyles} from "@material-ui/core";


const styles = () => ({
    expansionPanelRoot: {
        borderRadius: '8px !important',
        color: '#586069',
        width: 500,
        '@media (max-width: 550px)': {
            width: '91vw'
        }
    },
    expansionPanelSummaryRoot: {
        alignItems: 'flex-start',
        borderRadius: 8,
    },
    forkedFrom: {
        color: '#586069',
        '& a': {
            textDecoration: 'none',
        },
        '& a:not(:hover)': {
            color: '#586069',
        },
        '& a:hover': {
            color: '#3f51b5'
        }
    },
    titleItem: {
        marginBottom: 16,
        '& > h6 > a': {
            color: '#3f51b5',
            textDecoration: 'none',
            '&:hover': {
                textDecoration: 'underline'
            }
        }
    },
    undisabled: {
        backgroundColor: 'white !important',
        opacity: '1 !important',
        pointerEvents: 'auto !important',
    }
})

const ProjectCard = ({ classes, description, parent, repoName, repoUrl }) => {
    return (
        <ExpansionPanel classes={{ root: classes.expansionPanelRoot, disabled: classes.undisabled }} disabled expanded={false}>
            <ExpansionPanelSummary classes={{ root: classes.expansionPanelSummaryRoot, disabled: classes.undisabled }}>
                <Grid container direction="column">
                    <Grid className={classes.titleItem} item>
                        <Typography variant="h6"><a href={repoUrl}>{repoName}</a></Typography>
                        { parent && (
                            <React.Fragment>
                                <Typography className={classes.forkedFrom} variant="body2">
                                    Forked from <a href={parent.url}>{parent.name}</a>
                                </Typography>
                            </React.Fragment>
                        )}
                    </Grid>
                    <Grid item>
                        <Typography variant="body1">{description}</Typography>
                    </Grid>
                </Grid>
            </ExpansionPanelSummary>
        </ExpansionPanel>
    )
}

export default withStyles(styles)(ProjectCard)
