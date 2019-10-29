import React, { Component } from 'react';
import axios from 'axios';
import { Table } from 'reactstrap';
import { oc } from 'ts-optchain';

export class Home extends Component<{}, HomeState> {
  static displayName = Home.name;

  constructor(props: {}) {
    super(props);

    this.state = {};

    this.load();
  }

  async load() {
    const response = await axios.get('api/csv/-');
    const { columns, cells } = response.data;
    this.setState({ columns, cells });
  }





  render () {
    return (
      this.state.columns != null ?
        (
          <Table>
            {
              oc(this.state.columns)([]).map((column, k) =>
                <tr key={k}><td>{column}</td></tr>
              )
            }
          </Table>
        )
        : null
    );
  }
}

interface HomeState {
  columns?: string[];
  cells?: string[][];
}