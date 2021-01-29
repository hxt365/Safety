import { Button, Input, InputNumber, Select, Form, Modal } from 'antd';
import React, { useContext, useState } from 'react';
import UserAvatar from '_components/share/UserAvatar';
import { userContext } from '_store';
import './EditUserModal.scss';
import { updateCurrentUser } from '_services/api';

export default function EditUserModal({ visible, closeModal }) {
  const { curUser, userDispatch } = useContext(userContext);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [form] = Form.useForm();

  const initialUserFormData = {
    first_name: curUser.properties.first_name,
    last_name: curUser.properties.last_name,
    gender: curUser.properties.gender,
    age: curUser.properties.age,
  };

  const uploadForm = async (values) => {
    setLoading(true);
    const res = await updateCurrentUser(values);
    setLoading(false);
    if (!res.ok) {
      setErrorMsg('Something has gone wrong. Please try again!');
      return;
    }

    const { user } = res;
    userDispatch({
      type: 'set_user',
      payload: user,
    });
    closeModal();
  };

  const onCancel = () => {
    form.resetFields();
    closeModal();
  };

  const onSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        uploadForm(values);
      })
      .catch((info) => info);
  };

  return (
    <Modal visible={visible} onCancel={onCancel} footer={null}>
      <div className="edit-user-modal">
        <UserAvatar src={curUser.properties.avatar} size={120} />
        <p className="edit-user-modal__error-msg">{errorMsg}</p>
        <div className="edit-user-modal__form">
          <Form
            form={form}
            layout="horizontal"
            initialValues={initialUserFormData}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            labelAlign="left"
          >
            <Form.Item
              label="First name"
              name="first_name"
              rules={[
                { required: true, message: 'First name is required.' },
                { type: 'string', max: 150 },
              ]}
            >
              <Input placeholder="Your first name" />
            </Form.Item>

            <Form.Item
              label="Last name"
              name="last_name"
              rules={[
                { required: true, message: 'Last name is required.' },
                { type: 'string', max: 150 },
              ]}
            >
              <Input placeholder="Your last name" />
            </Form.Item>

            <Form.Item
              label="Gender"
              name="gender"
              rules={[{ required: true, message: 'Gender is required.' }]}
            >
              <Select>
                <Select.Option value="M">Male</Select.Option>
                <Select.Option value="F">Female</Select.Option>
                <Select.Option value="O">Other</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Age"
              name="age"
              rules={[
                { required: true, message: 'Age is required.' },
                { type: 'number', min: 13 },
              ]}
            >
              <InputNumber min={13} />
            </Form.Item>

            <div className="align-center">
              <Form.Item>
                <Button
                  key="submit"
                  type="primary"
                  shape="round"
                  size="large"
                  onClick={onSubmit}
                  loading={loading}
                >
                  Submit
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </Modal>
  );
}
