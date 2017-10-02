import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import "./Home.css";
import { invokeApig } from '../libs/awsLib';
import { Link } from "react-router-dom";

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            tasks: []
        };
    }

    async componentDidMount() {
        if (!this.props.isAuthenticated) {
            return;
        }

        try {
            const results = await this.tasks();
            this.setState({ tasks: results });
        } catch (e) {
            alert(e);
        }

        this.setState({ isLoading: false });
    }

    tasks() {
        return invokeApig({ path: "/tasks" });
    }

    renderTasksList(tasks) {
        return [{}].concat(tasks).map(
            (task, i) =>
                i !== 0
                    ? <ListGroupItem
                        key={task.taskid}
                        href={`/tasks/${task.taskid}`}
                        onClick={this.handleNoteClick}
                        header={task.content.trim().split("\n")[0]}
                    >
                        {"Created: " + new Date(task.createdAt).toLocaleString()}
                    </ListGroupItem>
                    : <ListGroupItem
                        key="new"
                        href="/tasks/new"
                        onClick={this.handleTaskClick}
                    >
                        <h4>
                            <b>{"\uFF0B"}</b> Create a new Task
                        </h4>
                    </ListGroupItem>
        );
    }

    handleTaskClick = event => {
        event.preventDefault();
        this.props.history.push(event.currentTarget.getAttribute("href"));
    }

    renderLander() {
        return (
            <div className="lander">
                <h1>SLTask</h1>
                <p>A Serverless Task List App</p>
                <div>
                    <Link to="/login" className="btn btn-info btn-lg">
                        Login
                    </Link>
                    <Link to="/signup" className="btn btn-success btn-lg">
                        Signup
                    </Link>
                </div>
            </div>
        );
    }

    renderTasks() {
        return (
            <div className="notes">
                <PageHeader>Your Tasks</PageHeader>
                <ListGroup>
                    {!this.state.isLoading && this.renderTasksList(this.state.tasks)}
                </ListGroup>
            </div>
        );
    }

    render() {
        return (
            <div className="Home">
                {this.props.isAuthenticated ? this.renderTasks() : this.renderLander()}
            </div>
        );
    }
}