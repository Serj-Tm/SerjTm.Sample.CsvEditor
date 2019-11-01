import React, { Component } from 'react';
import axios from 'axios';
import { Table, Row, Col, Button, ButtonGroup, Input } from 'reactstrap';
import { oc } from 'ts-optchain';
import * as api from '../api/csv';
import { HeaderWidget } from '../controls/header';
import { CsvSetting, CsvSettingWidget } from '../controls/CsvSetting';

export class Home extends Component<{}, HomeState> {
  static displayName = Home.name;

  constructor(props: {}) {
    super(props);

    this.state = {};

    this.load();
  }

  async load() {
    if (this.state.csvSetting == null)
      return;

    const { headers, rows } = await api.process(this.state.csvSetting.filename, { separator: this.state.csvSetting.separator, isHeader: this.state.csvSetting.isHeader });
    this.setState({ headers, rows });
  }

  setHeaders = async (headers: string[]) => {
    await axios.put('/api/csv/-/headers', { headers });

    await this.load();
  }

  setSetting = async (csvSetting: CsvSetting) => {
    await this.setStateAsync({ csvSetting });

    await this.load();
  }

  setStateAsync<K extends keyof HomeState>(state: Pick<HomeState, K>) {
    return new Promise((resolve) => {
      this.setState(state, resolve)
    });
  }


  render () {
    return (
      <Row>
        <Col sm='4'>
          <CsvSettingWidget apply={this.setSetting}/>
        </Col>
        <Col sm='8'>
          {
            this.state.headers != null ?
              (
                <HeaderWidget headers={this.state.headers} apply={this.setHeaders} />
              )
              : null
          }
          {
            this.state.headers != null && this.state.rows != null ?
              (
                <DataTable headers={this.state.headers} rows={this.state.rows} />
              )
              : null
          }
        </Col>
      </Row>
    );
  }
}



function DataTable(props: { headers: string[], rows: string[][] }) {
  const { headers, rows } = props;

  return (
    <div>
      <ButtonGroup><h3>Данные</h3><span></span><Button style={{ marginLeft: '10px' }}>Редактировать</Button></ButtonGroup>
      <Table>
        <tbody>
          <tr>
            {
              headers.map((header, k) =>
                <th key={k}>{header}</th>
              )
            }
          </tr>
          {
            rows.map((row, k) =>
              <tr key={k}>
                  {row.map((cell, kc) =>
                    <td key={kc}>{cell}</td>
                    )
                  }
              </tr>
            )
          }
         </tbody>
      </Table>
    </div>);

}


interface HomeState {
  csvSetting?: CsvSetting;
  headers?: string[];
  rows?: string[][];
}