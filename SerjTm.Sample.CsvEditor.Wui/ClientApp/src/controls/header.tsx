import React, { Component } from 'react';
import { Table, Button, ButtonGroup, Input } from 'reactstrap';


export class HeaderWidget extends Component<{ headers: string[], apply: (headers: string[]) => void }, { isEdit: boolean }> {
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


export function HeaderView(props: { headers: string[] }) {
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


export class HeaderEditor extends Component<HeaderEditorProps, { headers: string[] }> {
  static displayName = HeaderEditor.name;

  constructor(props: HeaderEditorProps) {
    super(props);

    const { headers } = props;

    this.state = { headers };

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
