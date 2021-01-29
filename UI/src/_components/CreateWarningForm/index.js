import { UploadOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Input, Select, Upload } from 'antd';
import React, { useContext, useState } from 'react';
import { TOPIC_NAMES } from '_constants';
import { createWarning } from '_services/api';
import { mapContext, warningContext } from '_store';
import './CreateWarningForm.scss';

export default function CreateWarningForm() {
  const { mapState } = useContext(mapContext);
  const { warningState, warningDispatch } = useContext(warningContext);
  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [rawPhotos, setRawPhotos] = useState([]);

  const [form] = Form.useForm();

  const getLocation = () => {
    setLoadingLocation(true);
    const { map } = mapState;
    map.renderCenterMarker();
  };

  const gotLocation = () => {
    const { map } = mapState;
    const loc = map.getCenter();
    setLocation(loc);
    form.setFieldsValue({
      location: `POINT(${loc?.lng} ${loc?.lat})`,
    });
    map.removeCenterMarker();
    setLoadingLocation(false);
  };

  const beforeUploadPhoto = (photo) => {
    const reader = new FileReader();
    reader.readAsDataURL(photo);
    reader.onloadend = () => {
      setPhotos((photoS) => [...photoS, { ...photo, status: 'done', url: reader.result }]);
      setRawPhotos((rawPhotoS) => [...rawPhotoS, photo]);
    };
    return false;
  };

  const onRemovePhoto = (photo) => {
    const newPhotos = [...photos];
    const id = newPhotos.findIndex((item) => item.uid === photo.uid);
    newPhotos.splice(id, 1);
    setPhotos(newPhotos);

    const newRawPhotos = [...rawPhotos];
    newRawPhotos.splice(id, 1);
    setRawPhotos(newRawPhotos);
  };

  const resetForm = () => {
    form.resetFields();
    setLocation(null);
    setPhotos([]);
    setRawPhotos([]);
  };

  const onFinish = async (data) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('topic', data.topic);
    formData.append('short_description', data.short_description);
    formData.append('long_description', data.long_description);
    formData.append('time', data.time.format());
    formData.append('location', data.location);
    rawPhotos.forEach((photo) => {
      formData.append('photos', photo);
    });

    const res = await createWarning(formData);

    setUploading(false);
    if (!res.ok) return;
    const { warning } = res;

    warningDispatch({
      type: 'create_warning',
      payload: warning,
    });

    resetForm();
    mapState.map.refreshMap(warningState.results);
  };

  let btnTitle = 'Pick a location';
  if (loadingLocation) btnTitle = 'Got the location';
  else if (location) btnTitle = 'Pick another location';

  return (
    <div className="create-warning-form">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="topic"
          label="Topic"
          rules={[{ required: true, message: 'Topic is required' }]}
        >
          <Select placeholder="Choose a topic">
            {Object.entries(TOPIC_NAMES).map(([key, value]) => (
              <Select.Option key={key} value={key}>
                {value}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="short_description"
          label="Short description"
          rules={[{ required: true, message: 'Short description is required' }]}
        >
          <Input placeholder="A short description" />
        </Form.Item>

        <Form.Item
          name="long_description"
          label="Long description"
          rules={[{ required: true, message: 'Long description is required' }]}
        >
          <Input placeholder="An in-detail description" />
        </Form.Item>

        <Form.Item
          name="time"
          label="When it happened?"
          rules={[{ required: true, message: 'Time is required' }]}
        >
          <DatePicker showTime showSecond={false} placeholder="Choose time" />
        </Form.Item>

        <Form.Item
          name="location"
          hidden
          rules={[{ required: true, message: 'Location is required' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Where it happened?"
          id="locationBtn"
          name="location"
          rules={[{ required: true, message: 'Location is required' }]}
        >
          <Button type="dashed" onClick={loadingLocation ? gotLocation : getLocation}>
            {btnTitle}
          </Button>
        </Form.Item>

        <Form.Item label="Attach photos">
          <Upload
            listType="picture-card"
            beforeUpload={beforeUploadPhoto}
            fileList={photos}
            onRemove={onRemovePhoto}
            accept="image/*"
          >
            <UploadOutlined />
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={uploading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
