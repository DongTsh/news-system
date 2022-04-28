import React, { useContext, useState, useEffect, useRef } from 'react';
import { Modal, Table, Input, Button, Form } from 'antd';
import axios from 'axios'

import {
    DeleteOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';

const { confirm } = Modal;

const EditableContext = React.createContext(null);

export default function CategoryNews() {

    const [dataSource, setDataSource] = useState([])

    useEffect(() => {
        axios.get('/categories')
            .then(res => {
                setDataSource(res.data)
            })
    }, [])

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: id => <b>{id}</b>
        },
        {
            title: '栏目名称',
            dataIndex: 'title',
            onCell: (record) => ({
                record,
                editable: true,
                dataIndex: 'title',
                title: '栏目名称',
                handleSave: handleSave,
            }),
        },
        {
            title: '操作',
            render: item => {
                return (
                    <>
                        <Button danger shape='circle' icon={<DeleteOutlined />} onClick={() => confirmMethod(item)}></Button>
                    </>
                )
            }
        }
    ];

    const handleSave = (record) => {
        setDataSource(dataSource.map(item => {
            return item.id === record.id ? {...record, value: record.title} : item
        }))

        axios.patch(`/categories/${record.id}`, {
            ...record,
            value: record.title
        })
    }

    const deleteMethod = item => {
        setDataSource(dataSource.filter(data => data.id !== item.id))
        axios.delete(`/categories/${item.id}`)
    }

    const confirmMethod = item => confirm({
        title: '是否要删除此项',
        icon: <ExclamationCircleOutlined />,
        okText: '是',
        cancelText: '否',
        onOk() {
            deleteMethod(item)
        },
        onCancel() {

        },
    });

    const EditableRow = ({ index, ...props }) => {
        const [form] = Form.useForm();
        return (
            <Form form={form} component={false}>
                <EditableContext.Provider value={form}>
                    <tr {...props} />
                </EditableContext.Provider>
            </Form>
        );
    };

    const EditableCell = ({
        title,
        editable,
        children,
        dataIndex,
        record,
        handleSave,
        ...restProps
    }) => {
        const [editing, setEditing] = useState(false);
        const inputRef = useRef(null);
        const form = useContext(EditableContext);
        useEffect(() => {
            if (editing) {
                inputRef.current.focus();
            }
        }, [editing]);

        const toggleEdit = () => {
            setEditing(!editing);
            form.setFieldsValue({
                [dataIndex]: record[dataIndex],
            });
        };

        const save = async () => {
            try {
                const values = await form.validateFields();
                toggleEdit();
                handleSave({ ...record, ...values });
            } catch (errInfo) {
                console.log('Save failed:', errInfo);
            }
        };

        let childNode = children;

        if (editable) {
            childNode = editing ? (
                <Form.Item
                    style={{
                        margin: 0,
                    }}
                    name={dataIndex}
                    rules={[
                        {
                            required: true,
                            message: `${title} is required.`,
                        },
                    ]}
                >
                    <Input ref={inputRef} onPressEnter={save} onBlur={save} />
                </Form.Item>
            ) : (
                <div
                    className="editable-cell-value-wrap"
                    style={{
                        paddingRight: 24,
                    }}
                    onClick={toggleEdit}
                >
                    {children}
                </div>
            );
        }

        return <td {...restProps}>{childNode}</td>;
    };

    return (
        <Table dataSource={dataSource} columns={columns}
            components={{
                body: {
                    row: EditableRow,
                    cell: EditableCell,
                },
            }}
            pagination={{
                pageSize: 5,
            }}
            rowKey={item => item.id}
        />
    )
}
