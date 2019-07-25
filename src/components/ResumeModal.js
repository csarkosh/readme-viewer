import React from 'react'
import {Modal, Paper, Slide, withStyles} from "@material-ui/core"
import PropTypes from 'prop-types'


const styles = () => ({
    modalPaper: {
        height: '85vh',
        margin: '24px auto 0',
        maxWidth: 800,
        width: '93vw',
        padding: 24,
    },
})


class ResumeModal extends React.Component {
    static propTypes = {
        classes: PropTypes.object,
        onClose: PropTypes.func.isRequired,
        open: PropTypes.bool.isRequired
    }

    render() {
        const { classes, onClose, open } = this.props
        return (
            <Modal
                aria-label="My Resume Modal"
                onClose={onClose}
                onEscapeKeyDown={onClose}
                open={open}
            >
                <Slide direction="up" in={open}>
                    <Paper className={classes.modalPaper}>
                        <embed
                            type="application/pdf"
                            title="My Resume"
                            height="100%"
                            width="100%"
                            src="/docs/CyrusSarkosh.resume.pdf"
                        />
                    </Paper>
                </Slide>
            </Modal>
        )
    }
}

export default withStyles(styles)(ResumeModal)
