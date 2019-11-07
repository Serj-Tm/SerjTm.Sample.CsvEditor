import React, { Component } from 'react';
import { Container, Card, CardHeader, CardBody, Form, FormGroup, Input, InputGroup, InputGroupAddon, Button, InputGroupText, Spinner, Label, FormFeedback, InputGroupButtonDropdown, DropdownToggle, DropdownMenu, ListGroup, ListGroupItem, DropdownItem, FormText } from 'reactstrap'
import { oc } from 'ts-optchain';


export class CsvSettingWidget extends Component<CsvSettingProps, CsvSettingState> {
  static displayName = CsvSettingWidget.name;

  constructor(props: CsvSettingProps) {
    super(props);


    this.state = {
      isDropDownOpened: false,
      isSeparatorButtonOpened: false,
      newSetting: { isHeader:true },
    };

  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>) => {
    const { target } = event;
    let value: any = target.type === 'checkbox' ? target.checked : target.value;
    if (value === '')
      value = null;

    const { name } = target;

    const newSetting = {
      ...this.state.newSetting, [name]: value
    };

    this.setState({
      newSetting: newSetting
    });
  }

  toggleDropDown = () => {
    this.setState({
      isDropDownOpened: !this.state.isDropDownOpened
    });
  }

  handleTab = (e: React.KeyboardEvent<HTMLInputElement>) => {

    const SHIFT = 16;
    const CTRL = 17;
    const ALT = 18;
    const BACKSPACE = 8;
    const TABKEY = 9;

    if (e.charCode != SHIFT && e.charCode != CTRL && e.charCode != ALT && e.charCode != BACKSPACE) {
      var ch = e.charCode == TABKEY ? '\t': String.fromCharCode(e.charCode);
      this.setState({ newSetting: { ...this.state.newSetting, separator: '\t' } })
      console.log({ newSetting: { ...this.state.newSetting, separator: '\t' } });
    }

    if (e.keyCode == TABKEY) {
      //(e.target as any).value += '\t';
      //this.setState({ newSetting: { ...this.state.newSetting, separator: oc(this.state.newSetting.separator)('') + '\t' } })
      if (e.preventDefault) {
        e.preventDefault();
      }
      //return true;
    }
    return false;
  }

  render() {
    const files = ['q.txt', 'q2.txt'];
    const separators = [
      { separator: '\t', title: 'tab' }, 
      { separator: ' ', title: 'пробел' }, 
      { separator: ',', title: ',' }, 
      { separator: ';', title: ';' }, 
    ];

    return (
      <Form>
        <FormGroup>
          <Label for="settingFilename">Файл</Label>
          <InputGroup>
            <Input id='settingFilename' readOnly style={{ backgroundColor: '#fff' }} value={toEmpty(this.state.newSetting.filename)} placeholder='выберите файл' />
            <InputGroupButtonDropdown addonType="append" isOpen={this.state.isDropDownOpened} toggle={this.toggleDropDown}>
              <DropdownToggle caret></DropdownToggle>
              <DropdownMenu right={true} style={{ maxHeight: '500px', overflowY: 'auto', minWidth: '200px', maxWidth: '600px', overflowX: 'auto' }}>
                <ListGroup>
                {

                    files.map((file, k) => <ListGroupItem key={k} tag='a' href='#' action active={file == this.state.newSetting.filename} onClick={(e) => { this.setState({ newSetting: { ...this.state.newSetting, filename: file } }); this.toggleDropDown(); e.preventDefault(); }}> {file}</ListGroupItem>)
                }
                </ListGroup>
              </DropdownMenu>
            </InputGroupButtonDropdown>
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <Label for="settingSeparator">Разделитель</Label>
          <InputGroup>
            <Input name="separator" id="settingSeparator" placeholder="укажите разделитель" value={toEmpty(this.state.newSetting.separator)}
              onChange={this.handleChange}
            />
            <InputGroupButtonDropdown addonType="append" isOpen={this.state.isSeparatorButtonOpened} toggle={() => this.setState({ isSeparatorButtonOpened: !this.state.isSeparatorButtonOpened })}>
              <DropdownToggle caret>
              </DropdownToggle>
              <DropdownMenu>
                {
                  separators.map((separator, k) => <DropdownItem disabled={separator.separator == this.state.newSetting.separator} onClick={() => this.setState({ newSetting: { ...this.state.newSetting, separator: separator.separator } })}>{separator.title}</DropdownItem>)
                }
              </DropdownMenu>
            </InputGroupButtonDropdown>
          </InputGroup>
          <FormText color="muted">
            {separators.map(separator => separator.separator != separator.title && separator.separator == this.state.newSetting.separator ? `(${separator.title})` : undefined )}
          </FormText>
        </FormGroup>

        <FormGroup check>
          <Label check>
            <Input type="checkbox" name='isHeader' checked={this.state.newSetting.isHeader} onChange={this.handleChange} />{' '}
            Присутствуют заголовки
        </Label>
        </FormGroup>
        <Button disabled={this.state.newSetting.filename == null || this.state.newSetting.separator == null} onClick={() => this.apply()}> Загрузить</Button>
      </Form>
    );
  }
  apply = () => {
    console.log(this.state);
    this.props.apply({ filename: this.state.newSetting.filename!, separator: this.state.newSetting.separator!, isHeader: this.state.newSetting.isHeader });
  }

}

interface CsvSettingState {
  newSetting: { filename?: string, separator?: string, isHeader: boolean, };
  isDropDownOpened: boolean;
  isSeparatorButtonOpened: boolean;
}

interface CsvSettingProps {
  apply: (setting: CsvSetting) => void;
}

function toEmpty(v: any, other?:any) {
  return v == null
    ? (other != null ? other : '')
    : v;
}

export interface CsvSetting {
  filename: string;
  separator: string;
  isHeader: boolean;
}