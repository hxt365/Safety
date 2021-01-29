import { Button, Form, Slider } from 'antd';
import React, { useContext, useState } from 'react';
import { MAX_DISTANCE, MAX_TIMEDELTA, MIN_DISTANCE, MIN_TIMEDELTA } from '_constants';
import { getWarnings } from '_services/api';
import { mapContext, warningContext } from '_store';
import { pluralize } from '_utils';
import './WarningFilter.scss';

export default function WarningFilter() {
  const { warningState, warningDispatch } = useContext(warningContext);
  const { mapState } = useContext(mapContext);
  const [loading, setLoading] = useState(false);

  const distanceFormatter = (value) => {
    return `${value / 1000}km`;
  };

  const timeFormatter = (value) => {
    const days = Math.floor(value / 24);
    const hours = value % 24;
    if (days && hours)
      return `${days} ${pluralize(days, 'day')} ${hours} ${pluralize(hours, 'hour')}`;
    if (days) return `${days} ${pluralize(days, 'day')}`;
    return `${hours} ${pluralize(hours, 'hour')}`;
  };

  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    const res = await getWarnings(values);
    setLoading(false);
    if (!res.ok) return;
    const { warnings } = res;
    warningDispatch({
      type: 'set_warnings',
      payload: warnings,
    });
    const { map } = mapState;
    map.refreshMap(warnings.results);
  };

  return (
    <div className="warning-filter">
      <Form form={form} initialValues={warningState.filter} onFinish={onFinish} labelAlign="left">
        <Form.Item name="distance" label="Distance:" labelCol={{ span: 4 }}>
          <Slider
            min={MIN_DISTANCE}
            max={MAX_DISTANCE}
            step={500}
            marks={{ 500: '0.5km', 10000: '10km', 20000: '20km', 30000: '30km' }}
            tipFormatter={distanceFormatter}
          />
        </Form.Item>

        <Form.Item name="inHours" label="Time" labelCol={{ span: 4 }}>
          <Slider
            min={MIN_TIMEDELTA}
            max={MAX_TIMEDELTA}
            step={1}
            marks={{ 1: '1 hour', 24: '1 day', 72: '3 days', 168: '1 week' }}
            tipFormatter={timeFormatter}
          />
        </Form.Item>

        {/* <Form.Item
          name="fromFollowees"
          label="Only from followees"
          valuePropName="checked"
          labelCol={{ span: 7.5 }}
        >
          <Checkbox />
        </Form.Item> */}

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Refresh
          </Button>
          <Button type="default" onClick={() => form.resetFields()}>
            Reset
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
