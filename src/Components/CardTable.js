import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../Store/store'
import styled from 'styled-components';
import { BasicContainer, SubContainer } from './Containers';
import { Text } from './Texts';

const CardTableBase = (props) => {

    const { Theme } = useContext(Context);
    const { cardTable } = Theme;
    const [CheckedArray, setCheckedArray] = useState([]);//目前已勾選
    const [CheckedPatchArray, setCheckedPatchArray] = useState([]);//存放當頁所有id
    const [ColOrder, setColOrder] = useState({ colName: "", order: "" });//存放欄位排序狀況 
    const [Data, setData] = useState([]);
    const [PagesInfo, setPagesInfo] = useState({});//頁面資訊

    useEffect(() => {
        //console.log(props.data)
        setPagesInfo(props.data);
        setData(props.data.data);
        setCheckedPatchArray((props.data.data ?? []).map((item, index) => (
            item.Id
        )))
        setColOrder({ colName: "", order: "" })
    }, [props.data])

    return (
        <>
            {(Data ?? []).map((item, index) => (
                <React.Fragment key={`${index}`}>
                    <BasicContainer theme={props?.theme?.basicContainer ?? cardTable.basicContainer}>
                        {(props.colKeys ?? []).map((subItem, subIndex) => (
                            <BasicContainer
                                key={`${subItem}${subIndex}`}
                                theme={props?.theme?.[subItem]?.rowContainer ? props.theme[subItem].rowContainer : props?.theme?.rowContainer ?? cardTable.rowContainer}>
                                {props?.theme?.[subItem]?.renderTitle ?
                                    props.theme[subItem].renderTitle(props.title[subIndex], item.Id ?? null, item)
                                    : <Text theme={props?.theme?.rowTitle ?? cardTable.rowTitle}>{`${props.title[subIndex]}`}</Text>
                                }
                                {props?.theme?.[subItem]?.renderContent ?
                                    props.theme[subItem].renderContent(item[subItem], item.Id ?? null, item)
                                    : <Text theme={props?.theme?.rowContent ?? cardTable.rowContent}>{`${item[subItem]}`}</Text>
                                }
                            </BasicContainer>

                        ))
                        }
                    </BasicContainer>
                </React.Fragment>
            ))}
        </>
    )
}

export const CardTable = styled(CardTableBase).attrs((props) => ({}))`

`

const CardTableBase1row3card = (props) => {

    const { Theme } = useContext(Context);
    const { cardTable } = Theme;
    const [CheckedArray, setCheckedArray] = useState([]);//目前已勾選
    const [CheckedPatchArray, setCheckedPatchArray] = useState([]);//存放當頁所有id
    const [ColOrder, setColOrder] = useState({ colName: "", order: "" });//存放欄位排序狀況 
    const [Data, setData] = useState([]);
    const [PagesInfo, setPagesInfo] = useState({});//頁面資訊

    useEffect(() => {
        //console.log(props.data)
        setPagesInfo(props.data);
        setData(props.data.data);
        setCheckedPatchArray((props.data.data ?? []).map((item, index) => (
            item.Id
        )))
        setColOrder({ colName: "", order: "" })
    }, [props.data])

    return (
        <>
            {(Data ?? []).map((item, index) => (
                <React.Fragment key={`${index}`}>
                    <SubContainer theme={props?.theme?.basicContainer ?? { ...cardTable.basicContainer, display: 'inline-block', width: '32%' }}>
                        {(props.colKeys ?? []).map((subItem, subIndex) => (
                            <BasicContainer
                                key={`${subItem}${subIndex}`}
                                theme={props?.theme?.[subItem]?.rowContainer ? props.theme[subItem].rowContainer : props?.theme?.rowContainer ?? cardTable.rowContainer}>
                                {props?.theme?.[subItem]?.renderTitle ?
                                    props.theme[subItem].renderTitle(props.title[subIndex], item.Id ?? null, item)
                                    : <Text theme={props?.theme?.rowTitle ?? cardTable.rowTitle}>{`${props.title[subIndex]}`}</Text>
                                }
                                {props?.theme?.[subItem]?.renderContent ?
                                    props.theme[subItem].renderContent(item[subItem], item.Id ?? null, item)
                                    : <Text theme={props?.theme?.rowContent ?? cardTable.rowContent}>{`${item[subItem]}`}</Text>
                                }
                            </BasicContainer>

                        ))
                        }
                    </SubContainer>
                </React.Fragment>
            ))}
        </>
    )
}

export const CardTable3in1 = styled(CardTableBase1row3card).attrs((props) => ({}))`

`