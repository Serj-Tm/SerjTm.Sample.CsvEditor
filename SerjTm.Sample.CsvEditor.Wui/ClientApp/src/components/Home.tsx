import React, { Component } from 'react';
import axios from 'axios';
import { Table, Row, Col, Button, ButtonGroup, Input } from 'reactstrap';
import { oc } from 'ts-optchain';
import * as api from './../api/csv';

export class Home extends Component<{}, HomeState> {
  static displayName = Home.name;

  constructor(props: {}) {
    super(props);

    this.state = {};

    this.load();
  }

  async load() {
    const { headers, rows } = await api.process('-', { separator: '\t', isHeader: true });
    this.setState({ headers, rows });
  }

  setHeaders = async (headers: string[]) => {
    await axios.put('/api/csv/-/headers', { headers });

    await this.load();
  }



  render () {
    return (
      <Row>
        <Col sm='4'>
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

class HeaderWidget extends Component<{ headers: string[], apply:(headers:string[])=>void}, { isEdit: boolean }> {
  static displayName = HeaderWidget.name;

  constructor(props: { headers: string[], apply: (headers: string[]) => void }) {
    super(props);

    this.state = { isEdit: false };

  }
  toggleEdit = () => {
    this.setState({ isEdit: !this.state.isEdit });
  }

  render() {
    return (
      <div>
        <ButtonGroup><h3>Колонки</h3><span></span><Button style={{ marginLeft: '10px' }} onClick={() => this.toggleEdit()}>Редактировать</Button></ButtonGroup>
        {this.state.isEdit ? <HeaderEditor headers={this.props.headers} cancel={this.toggleEdit} apply={(headers) => { this.props.apply(headers); this.toggleEdit(); }} /> : <HeaderView headers={this.props.headers} />}
      </div>);
  }
}


function HeaderView(props: { headers: string[] }) {
  const { headers } = props;

  return (
      <Table>
        <tbody>
          {
            headers.map((header, k) =>
              <tr key={k}><td>{header}</td></tr>
            )
          }
        </tbody>
      </Table>
    );
}


class HeaderEditor extends Component<HeaderEditorProps, {headers:string[]}> {
  static displayName = HeaderEditor.name;

  constructor(props: HeaderEditorProps) {
    super(props);

    const { headers } = props;

    this.state = {headers};

  }
  handle = (i: number, v: string) => {
    const headers = [...this.state.headers];
    headers[i] = v;
    this.setState({ headers: headers });
  }

  render() {
    return (
      <div>
        <Table>
          <tbody>
            {
              this.state.headers.map((header, i) =>
                <tr key={i}><td><Input value={header} onChange={e => this.handle(i, e.target.value)} /></td></tr>
              )
            }
          </tbody>
        </Table>
        <Button onClick={() => this.props.apply(this.state.headers)}>Применить</Button>{' '}
        <Button onClick={() => this.props.cancel()}>Отмена</Button>
      </div>
    );
  }
}

interface HeaderEditorProps {
  headers: string[];
  cancel: () => void;
  apply: (headers: string[]) => void;
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
  headers?: string[];
  rows?: string[][];
}