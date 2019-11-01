import React, { Component } from 'react';
import { Container, Card, CardHeader, CardBody, Form, FormGroup, Input, InputGroup, InputGroupAddon, Button, InputGroupText, Spinner, Label, FormFeedback, InputGroupButtonDropdown, DropdownToggle, DropdownMenu } from 'reactstrap'
import { oc } from 'ts-optchain';


export class CsvSettingWidget extends Component<CsvSettingProps, CsvSettingState> {
  static displayName = CsvSettingWidget.name;

  constructor(props: CsvSettingProps) {
    super(props);


    this.state = {
      isDropDownOpened: false,
      newSetting: { filename: 'q', isHeader:true },
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
    const TABKEY = 9;
    if (e.keyCode == TABKEY) {
      //(e.target as any).value += '\t';
      this.setState({ newSetting: { ...this.state.newSetting, separator: oc(this.state.newSetting.separator)('') + '\t' } })
      if (e.preventDefault) {
        e.preventDefault();
      }
      return true;
    }
  }

  render() {
    return (
      <Form>
        <FormGroup>
          <Label for="settingFilename">Файл</Label>
          <InputGroup>
            <Input id='settingFilename' readOnly style={{ backgroundColor: '#fff' }} value={toEmpty(this.state.newSetting.filename)} placeholder='выберите файл' />
            <InputGroupButtonDropdown addonType="append" isOpen={this.state.isDropDownOpened} toggle={this.toggleDropDown}>
              <DropdownToggle caret/>
              <DropdownMenu style={{ maxHeight: '500px', overflowY: 'auto', maxWidth: '600px', overflowX: 'auto' }}>
                <div>bla-bla</div>
              </DropdownMenu>
            </InputGroupButtonDropdown>
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <Label for="settingSeparator">Разделитель</Label>
          <Input name="separator" id="settingSeparator" placeholder="укажите разделитель" value={toEmpty(this.state.newSetting.separator)}
            onChange={this.handleChange}
            onKeyDown={this.handleTab} />
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