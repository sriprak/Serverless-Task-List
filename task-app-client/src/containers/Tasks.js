import React, { Component } from "react";
import { invokeApig } from "../libs/awsLib";
import { FormGroup, FormControl } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
//import config from "../config";
import "./Tasks.css";

export default class Tasks extends Component {
    constructor(props) {
        super(props);

        //this.file = null;

        this.state = {
            isLoading: null,
            isDeleting: null,
            note: null,
            content: ""
        };
    }

    async componentDidMount() {
        try {
            const results = await this.getTask();
            this.setState({
                task: results,
                content: results.content
            });
        } catch (e) {
            alert(e);
        }
    }

    getTask() {
        return invokeApig({ path: `/tasks/${this.props.match.params.id}` });
    }

    validateForm() {
        return this.state.content.length > 0;
    }

    // formatFilename(str) {
    //     return str.length < 50
    //         ? str
    //         : str.substr(0, 20) + "..." + str.substr(str.length - 20, str.length);
    // }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    // handleFileChange = event => {
    //     this.file = event.target.files[0];
    // }

    saveTask(task) {
        return invokeApig({
            path: `/tasks/${this.props.match.params.id}`,
            method: "PUT",
            body: task
        });
    }

    handleSubmit = async event => {
        event.preventDefault();

        // if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
        //     alert("Please pick a file smaller than 5MB");
        //     return;
        // }

        this.setState({ isLoading: true });

        try {

            await this.saveTask({
                ...this.state.note,
                content: this.state.content,
                // attachment: uploadedFilename || this.state.note.attachment
            });
            this.props.history.push("/");
        } catch (e) {
            alert(e);
            this.setState({ isLoading: false });
        }
    };

    deleteTask() {
        return invokeApig({
            path: `/tasks/${this.props.match.params.id}`,
            method: "DELETE"
        });
    }

    handleDelete = async event => {
        event.preventDefault();

        const confirmed = window.confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmed) {
            return;
        }

        this.setState({ isDeleting: true });

        try {
            await this.deleteTask();
            this.props.history.push("/");
        } catch (e) {
            alert(e);
            this.setState({ isDeleting: false });
        }
    };

    render() {
        return (
            <div className="Tasks">
                {this.state.task &&
                <form onSubmit={this.handleSubmit}>
                    <FormGroup controlId="content">
                        <FormControl
                            onChange={this.handleChange}
                            value={this.state.content}
                            type="text"
                        />
                    </FormGroup>
                    {/*{this.state.note.attachment &&*/}
                    {/*<FormGroup>*/}
                        {/*<ControlLabel>Attachment</ControlLabel>*/}
                        {/*<FormControl.Static>*/}
                            {/*<a*/}
                                {/*target="_blank"*/}
                                {/*rel="noopener noreferrer"*/}
                                {/*href={this.state.note.attachment}*/}
                            {/*>*/}
                                {/*{this.formatFilename(this.state.note.attachment)}*/}
                            {/*</a>*/}
                        {/*</FormControl.Static>*/}
                    {/*</FormGroup>}*/}
                    {/*<FormGroup controlId="file">*/}
                        {/*{!this.state.note.attachment &&*/}
                        {/*<ControlLabel>Attachment</ControlLabel>}*/}
                        {/*<FormControl onChange={this.handleFileChange} type="file" />*/}
                    {/*</FormGroup>*/}
                    <LoaderButton
                        block
                        bsStyle="primary"
                        bsSize="large"
                        disabled={!this.validateForm()}
                        type="submit"
                        isLoading={this.state.isLoading}
                        text="Save"
                        loadingText="Saving…"
                    />
                    <LoaderButton
                        block
                        bsStyle="danger"
                        bsSize="large"
                        isLoading={this.state.isDeleting}
                        onClick={this.handleDelete}
                        text="Delete"
                        loadingText="Deleting…"
                    />
                </form>}
            </div>
        );
    }
}