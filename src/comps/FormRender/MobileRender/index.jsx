import * as MobileComps from './MobileComps';
import {
  COMP_NAMES_MAP,
  COMP_NAMES,
  CATEGORY,
} from '@/pages/Editor/AuditForm/consts';
import { Form, Button } from 'react-vant';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import FormList from './FormList';
import styles from './styles.less';

const MobileRender = ({ layout, form, fieldConfigs, readOnly }) => {
  const behavior = (id) => {
    if (readOnly) return 'READONLY';
    const target = fieldConfigs?.find((el) => el.fieldId === id);
    if (!target) {
      console.error('field config 未找到');
    }
    return target?.fieldBehavior ?? 'NOMARL';
  };

  return (
    <Form form={form} layout="vertical" preserve={false}>
      {layout?.map((el) => {
        const config = behavior(el.id);

        if (el.category === CATEGORY.UI) {
          const Comp = MobileComps[COMP_NAMES_MAP[el.type]];
          return config !== 'HIDDEN' && <Comp key={el.id} {...el.attrs} />;
        }

        if (el.type === COMP_NAMES.GROUP) {
          return (
            config !== 'HIDDEN' && (
              <Form.Item
                label={el.attrs?.label}
                key={el.id}
                name={el.id}
                rules={[
                  {
                    required: el.attrs?.required,
                    message: '此项必填',
                  },
                ]}
              >
                <FormList
                  readOnly={config === 'READONLY'}
                  innerlist={el.children}
                />
              </Form.Item>
              // <div key={el.id} className={styles.groupWrapper}>
              //   {/* {config === 'READONLY' && <div className={styles.mask}></div>} */}
              //   <div className={styles.groupBox}>
              //     <div className={styles.header}>{el.attrs?.label}</div>
              //     <div className={styles.body}>
              //       <Form.List
              //         name={el.id}
              //         initialValue={[{ name: 'react-vant', age: '1' }]}
              //       >
              //         {(fields, { add, remove }) => (
              //           <>
              //             {fields.map(({ key, name, ...restField }, index) => (
              //               <div className={styles.innerblock}>
              //                 <div className={styles.box} key={key}>
              //                   {el?.children?.map((c) => {
              //                     const Comp =
              //                       MobileComps[COMP_NAMES_MAP[c.type]];
              //                     return (
              //                       <Form.Item
              //                         {...restField}
              //                         label={c.attrs?.label}
              //                         name={[name, c.id]}
              //                         rules={[
              //                           {
              //                             required: c.attrs?.required,
              //                             message: '必填',
              //                           },
              //                         ]}
              //                         initialValue={c.attrs?.value}
              //                       >
              //                         <Comp
              //                           {...c.attrs}
              //                           readOnly={config === 'READONLY'}
              //                           style={{ width: '100%' }}
              //                         />
              //                       </Form.Item>
              //                     );
              //                   })}
              //                 </div>
              //                 {config !== 'READONLY' && (
              //                   <div className={styles.removeBtn}>
              //                     <Button
              //                       round
              //                       block
              //                       plain
              //                       icon={<MinusCircleOutlined />}
              //                       size="small"
              //                       onClick={() => remove(index)}
              //                     >
              //                       移除选项
              //                     </Button>
              //                   </div>
              //                 )}
              //               </div>
              //             ))}
              //             {config !== 'READONLY' && (
              //               <div className={styles.bottomAction}>
              //                 <Button
              //                   type="primary"
              //                   round
              //                   block
              //                   plain
              //                   icon={<PlusOutlined />}
              //                   size="small"
              //                   onClick={() => add()}
              //                 >
              //                   添加选项
              //                 </Button>
              //               </div>
              //             )}
              //           </>
              //         )}
              //       </Form.List>
              //     </div>
              //   </div>
              // </div>
            )
          );
        }

        if (el.type === COMP_NAMES.SECTION) {
          return (
            config !== 'HIDDEN' && (
              <div key={el.id} className={styles.groupWrapper}>
                {/* {config === 'READONLY' && <div className={styles.mask}></div>} */}
                <div className={styles.groupBox}>
                  <div className={styles.header}>{el.attrs?.label}</div>
                  <div className={styles.body}>
                    {el?.children?.map((c, index) => {
                      const config = behavior(c.id);
                      if (config == 'HIDDEN') return;

                      const Comp = MobileComps[COMP_NAMES_MAP[c.type]];

                      return (
                        <Form.Item
                          label={c.attrs?.label}
                          key={c.id}
                          name={c.id}
                          rules={[
                            {
                              required: c.attrs?.required,
                              message: '此项必填',
                            },
                          ]}
                          initialValue={c.attrs?.value}
                        >
                          <Comp {...c.attrs} readOnly={config === 'READONLY'} />
                        </Form.Item>
                      );
                    })}
                  </div>
                </div>
              </div>
            )
          );
        }

        const Comp = MobileComps[COMP_NAMES_MAP[el.type]];

        return (
          config !== 'HIDDEN' && (
            <Form.Item
              key={el.id}
              label={el.attrs?.label}
              name={el.id}
              rules={[{ required: el.attrs.required, message: '此项必填' }]}
              initialValue={el.attrs?.value}
            >
              <Comp {...el.attrs} readOnly={config === 'READONLY'} />
            </Form.Item>
          )
        );
      })}
    </Form>
  );
};

export default MobileRender;
