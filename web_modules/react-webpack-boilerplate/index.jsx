"use strict";
import injectTapEventPlugin from "react-tap-event-plugin";
import HelloWorld from "react-webpack-boilerplate/React/HelloWorld";
import React from "react";

React.render(<HelloWorld />, document.body);

injectTapEventPlugin();
