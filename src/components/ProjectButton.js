import React from 'react'
import {withStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

const styles = () => ({
    wrapper: {
        border: '2px solid rgba(51, 60, 79, 0.73)',
        color: '#474f60',
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
            backgroundColor: 'transparent',
            border: '2px solid rgba(51, 60, 79, 0.9)',
            color: '#14181f',
            transition: 'border 0.25s, color 0.25s',
        },
        '& a': {
            color: '#333c4f',
            textDecoration: 'none',
            '&:hover, &:focus': {
                color: '#3f51b5'
            },
        },
    },
    titleWrapper: {
        fontSize: 16,
        '& a': {
            color: '#3f51b5',
            '&:hover, &:focus': {
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
            style={!selected ? undefined : {
                backgroundColor: 'white',
                border: '2px solid #14181f',
                color: '#14181f',
                transition: 'border 0.5s, color 0.5s, background-color 0.2s',
            }}
        >
            <Grid container direction="column">
                <Grid className={classes.titleWrapper} item>
                    <a href={url} onClick={stopPropagation} onFocus={stopPropagation}>{name}</a>
                </Grid>
                {parent && (
                    <Grid className={classes.forkedFromWrapper} item>
                        Forked from <a href={parent.url} onClick={stopPropagation} onFocus={stopPropagation}>{parent.name}</a>
                    </Grid>
                )}
                <Grid className={classes.descriptionWrapper} item>{description}</Grid>
            </Grid>
        </Button>
    )
})
