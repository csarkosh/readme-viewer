import React from 'react'
import {ButtonBase, withStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

const styles = () => ({
    wrapper: {
        border: '2px solid rgba(51, 60, 79, 0.73)',
        color: '#333c4f',
        maxWidth: 600,
        width: '40vw',
        minWidth: 350,
        textAlign: 'left !important',
        textTransform: 'none',
        '@media (max-width: 735px)': {
            minWidth: 'unset',
            width: '95vw'
        },
        '&:hover': {
            backgroundColor: '#f8fafc'
        },
        '& a': {
            color: '#333c4f',
            textDecoration: 'none',
            '&:hover': {
                color: '#3f51b5'
            },
        },
    },
    titleWrapper: {
        fontSize: 16,
        '& a': {
            color: '#3f51b5',
            '&:hover': {
                textDecoration: 'underline',
            },
        },
    },
    forkedFromWrapper: { marginTop: -6 },
    descriptionWrapper: { marginTop: 16 },
})

const stopPropagation = e => e.stopPropagation()

export default withStyles(styles)(({
    classes,
    description,
    onClick,
    parent,
    name,
    url,
    selected,
}) => {
    return (
        <Button
            className={classes.wrapper}
            variant="outlined"
            onClick={() => onClick(name)}
            style={selected ? {backgroundColor: '#fcfdfe'} : undefined}
        >
            <Grid container direction="column">
                <Grid className={classes.titleWrapper} item>
                    <a href={url} onClick={stopPropagation}>{name}</a>
                </Grid>
                {parent && (
                    <Grid className={classes.forkedFromWrapper} item>
                        Forked from <a href={parent.url} onClick={stopPropagation}>{parent.name}</a>
                    </Grid>
                )}
                <Grid className={classes.descriptionWrapper} item>{description}</Grid>
            </Grid>
        </Button>
    )
})
