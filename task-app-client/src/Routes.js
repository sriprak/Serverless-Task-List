import React from "react";
import { Route, Switch } from "react-router-dom";
import asyncComponent from "./components/AsyncComponent";
import AppliedRoute from "./components/AppliedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";

const AsyncHome = asyncComponent(() => import("./containers/Home"));
const AsyncLogin = asyncComponent(() => import("./containers/Login"));
const AsyncTasks = asyncComponent(() => import("./containers/Tasks"));
const AsyncSignup = asyncComponent(() => import("./containers/Signup"));
const AsyncNewTask = asyncComponent(() => import("./containers/NewTask"));
const AsyncNotFound = asyncComponent(() => import("./containers/NotFound"));

export default ({ childProps }) =>
    <Switch>
        <AppliedRoute
            path="/"
            exact
            component={AsyncHome}
            props={childProps}
        />
        <UnauthenticatedRoute
            path="/login"
            exact
            component={AsyncLogin}
            props={childProps}
        />
        <UnauthenticatedRoute
            path="/signup"
            exact
            component={AsyncSignup}
            props={childProps}
        />
        <AuthenticatedRoute
            path="/tasks/new"
            exact
            component={AsyncNewTask}
            props={childProps}
        />
        <AuthenticatedRoute
            path="/tasks/:id"
            exact
            component={AsyncTasks}
            props={childProps}
        />
        {/* Finally, catch all unmatched routes */}
        <Route component={AsyncNotFound} />
    </Switch>
;