import React, { useContext, useCallback, useState } from 'react';
import { Context } from '../../Store/store'
import { BasicContainer, SubContainer, Container } from '../../Components/Containers';
import { PageTitle } from '../../Components/PageTitle';
import { EasyButton, JumpDialogButton } from '../../Components/Buttons';
import AddIcon from '@material-ui/icons/Add';
import { SearchTextInput, FormRow } from '../../Components/Forms';
import { TableBasic } from '../../Components/Tables';
import { setItemlocalStorage, getItemlocalStorage, clearlocalStorage } from '../../Handlers/LocalStorageHandler'
import { useHistory } from 'react-router-dom';
import { useAsync } from '../../SelfHooks/useAsync';
import { useForm } from '../../SelfHooks/useForm'
import { useWindowSize } from '../../SelfHooks/useWindowSize'
import { Text } from '../../Components/Texts'
import CreateIcon from '@material-ui/icons/Create';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { CardTable, CardTable3in1 } from '../../Components/CardTable';
import { JumpDialog } from '../../Components/JumpDialog';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { alertService } from '../../Components/JumpAlerts';
import { FormCard } from '../../Components/FormCard';
import { TooltipBasic } from '../../Components/Tooltips';
import { CustomersAddCard } from './Customers/CustomersAddCard';
import { CustomersEditCard } from './Customers/CustomersEditCard';
import { CustomersPageTitleAddSearch } from './Customers/CustomersPageTitleAddSearch';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { PageSubTitle, PageSubTitleMobile } from '../../Components/PageSubTitle';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const overTheme = createMuiTheme({
    overrides: {
        // Style sheet name ⚛️
        MuiRadio: {
            // Name of the rule
            colorSecondary: {
                '&$checked': {
                    color: '#964f19',
                },
                color: '#964f19',

            },
        },
    },

});
const overThemeLessThan768 = createMuiTheme({
    overrides: {
        // Style sheet name ⚛️
        MuiRadio: {
            // Name of the rule
            colorSecondary: {
                '&$checked': {
                    color: '#964f19',
                },
                color: '#964f19',

            },
        },
        MuiFormControlLabel: {
            root: {
                width: '20%',
                'margin-right': '0',
                //'margin-left': '0',
                'min-width': '80px',
            },
        },
        MuiFormControl: {
            root: {
                display: 'block'
            }
        },

    },

});
const overTheme2 = createMuiTheme({
    overrides: {
        // Style sheet name ⚛️
        MuiPaper: {
            // Name of the rule
            elevation1: {
                'box-shadow': '0',

            },
        },
        MuiAccordionSummary: {
            root: {
                padding: '0',
                margin: '0',
                minHeight: '0',
                'justify-content': 'flex-start',
            },
            content: {
                margin: '0',
                'flex-grow': '0',
            }
        },
        MuiIconButton: {
            root: {
                padding: '0'
            }
        },
        MuiAccordionDetails: {
            root: {
                padding: '0',
            }
        }
    },

});
const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
}));

export const Test = (props) => {
    const classes = useStyles();

    const { APIUrl, Theme } = useContext(Context);
    const { pages: { testPage: { test } } } = Theme;
    let history = useHistory();
    const [TableData, setTableData] = useState([]);
    const [OpenDelJumpDialog, setOpenDelJumpDialog] = useState(false); // 開啟刪除彈窗
    const [OpenAddJumpDialog, setOpenAddJumpDialog] = useState(false); // 開啟新增彈窗
    const [OpenEditJumpDialog, setOpenEditJumpDialog] = useState(false); // 開啟編輯彈窗
    const [ScrollPage, setScrollPage] = useState(2); // 滾動到底部加載頁面
    const [DelWho, setDelWho] = useState(""); // 刪除彈窗中刪除名字
    const [EditAutoFill, setEditAutoFill] = useState({}); // 編輯彈窗中data
    const [SearchWord, setSearchWord] = useState(""); // 儲存關鍵字，供翻頁時的查詢用
    const [width] = useWindowSize();

    const [Id, Idhandler, IdregExpResult, IdResetValue] = useForm("", [""], [""]); // Id欄位
    const [Region, setRegion] = React.useState('北部');

    const handleChange = (event) => {
        setRegion(event.target.value);
    };

    //#region 重置表單欄位的State值
    const formValueReast = () => {

    }
    //#endregion

    //#region 查詢列表API
    const getRoleByPageOrkey = useCallback(async (page = 1, key) => {
        return await fetch(`${APIUrl}api/Shops/GetList`,
            {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${getItemlocalStorage("Auth")}`
                },
            }
        )//查詢角色、表格翻頁
            .then(Result => {
                const ResultJson = Result.clone().json();//Respone.clone()
                return ResultJson;
            })
            .then((PreResult) => {
                if (PreResult.Status === 401) {
                    //Token過期 強制登出
                    clearlocalStorage();
                    history.push("/Login");
                    throw new Error("Token過期 強制登出");
                }

                if (PreResult.success) {
                    //console.log(PreResult.response)
                    setTableData({ data: PreResult.response });
                    return "查詢角色表格資訊成功"
                } else {
                    throw new Error("查詢角色表格資訊失敗");
                }
            })
            .catch((Error) => {
                clearlocalStorage();
                history.push("/Login");
                throw Error;
            })
            .finally(() => {

            });

        // 這裡要接著打refresh 延長Token存活期

    }, [APIUrl, history])

    const [execute, Pending] = useAsync(getRoleByPageOrkey, true);
    //#endregion

    //#region 滾動底部加載查詢列表API
    const getRoleByPageOrkeyScrollBottom = useCallback(async (page = 1, key) => {
        return await fetch(`${APIUrl}api/UserInfo/Get?page=${page}&key=${(key ? `${key}` : "")}`,
            {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${getItemlocalStorage("Auth")}`
                },
            }
        )//查詢角色、表格翻頁
            .then(Result => {
                const ResultJson = Result.clone().json();//Respone.clone()
                return ResultJson;
            })
            .then((PreResult) => {
                if (PreResult.Status === 401) {
                    //Token過期 強制登出
                    clearlocalStorage();
                    history.push("/Login");
                    throw new Error("Token過期 強制登出");
                }

                if (PreResult.success) {
                    // console.log(PreResult.response)
                    setTableData((d) => ({ ...d, data: [...(d?.data ?? []), ...PreResult.response.data] }));
                    setScrollPage((p) => (p + 1)); // 頁數+1
                    return "查詢角色表格資訊成功"
                } else {
                    throw new Error("查詢角色表格資訊失敗");
                }
            })
            .catch((Error) => {
                clearlocalStorage();
                history.push("/Login");
                throw Error;
            })
            .finally(() => {

            });

        // 這裡要接著打refresh 延長Token存活期

    }, [APIUrl, history])

    const [executeScrollBottom, PendingScrollBottom] = useAsync(getRoleByPageOrkeyScrollBottom, false);
    //#endregion

    //#region 刪除顧客 API
    const delAdminUser = useCallback(async (id) => {
        //console.log("id")
        return await fetch(`${APIUrl}api/UserInfo/Delete?id=${id}`,
            {
                method: "DELETE",
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${getItemlocalStorage("Auth")}`
                }
            }
        )//刪除顧客
            .then(Result => {
                const ResultJson = Result.clone().json();//Respone.clone()
                return ResultJson;
            })
            .then((PreResult) => {
                if (PreResult.Status === 401) {
                    //Token過期 強制登出
                    clearlocalStorage();
                    history.push("/Login");
                    throw new Error("Token過期 強制登出");
                }

                if (PreResult.success) {
                    alertService.normal("刪除顧客成功", { autoClose: true });
                    return "刪除顧客成功"
                } else {
                    alertService.normal("刪除顧客失敗", { autoClose: true });
                    throw new Error("刪除顧客失敗");
                }
            })
            .catch((Error) => {
                throw Error;
            })
            .finally(() => {
                execute(1);
            });

        // 這裡要接著打refresh 延長Token存活期

    }, [APIUrl, history, execute])

    const [DelAdminUserExecute, DelAdminUserPending] = useAsync(delAdminUser, false);
    //#endregion

    //#region 新增顧客API 
    const addUser = useCallback(async (Name, Phone, Email, BirthYear, BirthMonth, BirthDay, County, District, Addr) => {
        //return console.log(`${BirthYear?.value}-${BirthMonth?.value}-${BirthDay?.value}`, `${ServiceArea.map((item) => { return item?.value })?.join()}`);
        //return console.log(Name, Phone, Email, BirthYear, BirthMonth, BirthDay, County, District, Addr)
        return await fetch(`${APIUrl}api/UserInfo/Post`,
            {
                method: "POST",
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${getItemlocalStorage("Auth")}`
                },
                body: JSON.stringify({
                    cLoginName: Email,
                    cLoginPWD: Phone,
                    cRealName: Name,
                    cBirthDay: `${BirthYear?.value}-${BirthMonth?.value}-${BirthDay?.value}`,
                    CreateTime: new Date(),
                    IsDeleted: false,
                    CommAddr: Addr,
                    CommCounty: County?.value,
                    CommDistrict: District?.value,
                    cEmail: Email,
                    cTel: Phone,
                })
            }
        )//查詢角色、表格翻頁
            .then(Result => {
                const ResultJson = Result.clone().json();//Respone.clone()
                return ResultJson;
            })
            .then((PreResult) => {
                //console.log(PreResult)
                if (PreResult.Status === 401) {
                    //Token過期 強制登出
                    clearlocalStorage();
                    history.push("/Login");
                    throw new Error("Token過期 強制登出");
                }

                if (PreResult.success) {
                    alertService.normal("成功新增顧客資訊", { autoClose: true });
                    return "成功新增顧客資訊"
                } else {
                    alertService.warn(PreResult.msg, { autoClose: true });
                    throw new Error("新增顧客資訊失敗");
                }
            })
            .catch((Error) => {
                throw Error;
            })
            .finally(() => {
                execute(1);
                setOpenAddJumpDialog(false);
            });

        // 這裡要接著打refresh 延長Token存活期

    }, [APIUrl, history])

    const [AddUserExecute, AddUserPending] = useAsync(addUser, false);
    //#endregion

    //#region 編輯顧客API 
    const editUser = useCallback(async (oldData, Name, Phone, Email, BirthYear, BirthMonth, BirthDay, County, District, Addr) => {
        //return console.log(`${BirthYear?.value}-${BirthMonth?.value}-${BirthDay?.value}`, `${ServiceArea.map((item) => { return item?.value })?.join()}`);
        //return console.log(Name, Phone, Email, BirthYear, BirthMonth, BirthDay, County, District, Addr)
        return await fetch(`${APIUrl}api/UserInfo/Put`,
            {
                method: "PUT",
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${getItemlocalStorage("Auth")}`
                },
                body: JSON.stringify({
                    ...oldData,
                    //cLoginName: Email,
                    //cLoginPWD: Phone,
                    cRealName: Name,
                    cBirthDay: `${BirthYear?.value}-${BirthMonth?.value}-${BirthDay?.value}`,
                    ModifyTime: new Date(),
                    IsDeleted: false,
                    CommAddr: Addr,
                    CommCounty: County?.value,
                    CommDistrict: District?.value,
                    cEmail: Email,
                    cTel: Phone,
                })
            }
        )//查詢角色、表格翻頁
            .then(Result => {
                const ResultJson = Result.clone().json();//Respone.clone()
                return ResultJson;
            })
            .then((PreResult) => {
                //console.log(PreResult)
                if (PreResult.Status === 401) {
                    //Token過期 強制登出
                    clearlocalStorage();
                    history.push("/Login");
                    throw new Error("Token過期 強制登出");
                }

                if (PreResult.success) {
                    alertService.normal("成功新增顧客資訊", { autoClose: true });
                    return "成功新增顧客資訊"
                } else {
                    alertService.warn(PreResult.msg, { autoClose: true });
                    throw new Error("新增顧客資訊失敗");
                }
            })
            .catch((Error) => {
                throw Error;
            })
            .finally(() => {
                execute(1);
                setOpenEditJumpDialog(false);
            });

        // 這裡要接著打refresh 延長Token存活期

    }, [APIUrl, history])

    const [EditUserExecute, EditUserPending] = useAsync(editUser, false);
    //#endregion

    return (
        <>
            {/* 寬度大於等於768時渲染的組件 */}
            {width > 768 && <BasicContainer theme={test.basicContainer}>
                <PageSubTitle title='服務據點' text={{ userSelect: "none", color: "#444", fontSize: "1.75em", fontWeight: 'normal', padding: " 0.2rem 0 12px 0", }}
                    container={{
                        direction: "row",
                        justify: "space-between",
                        padding: "0 40px 0 40px ",
                        width: '100%',
                        margin: '40px 0 0 0',
                        //height: '3rem',
                    }} />
                <BasicContainer theme={test.tableBasicContainer}>

                    <ThemeProvider theme={overTheme}>
                        <FormControl component="fieldset">
                            {/* <FormLabel component="legend">Gender</FormLabel> */}
                            <RadioGroup aria-label="gender" name="gender1" value={Region} onChange={handleChange} row>
                                <FormControlLabel value="北部" control={<Radio />} label="北部" />
                                <FormControlLabel value="中部" control={<Radio />} label="中部" />
                                <FormControlLabel value="南部" control={<Radio />} label="南部" />
                                <FormControlLabel value="東部" control={<Radio />} label="東部" />
                                <FormControlLabel value="離島" control={<Radio />} label="離島" />
                            </RadioGroup>
                        </FormControl>
                    </ThemeProvider>
                    <Container >
                        <CardTable3in1
                            data={{
                                ...TableData, data: TableData?.data?.filter((item) => {
                                    if (Region === '北部')
                                        return item?.County === '臺北市' || item?.County === '新北市' || item?.County === '基隆市' || item?.County === '宜蘭縣' || item?.County === '桃園市' || item?.County === '新竹縣' || item?.County === '新竹市';
                                    else if (Region === '中部')
                                        return item?.County === '臺中市' || item?.County === '苗栗縣' || item?.County === '彰化縣' || item?.County === '南投縣' || item?.County === '雲林縣';
                                    else if (Region === '南部')
                                        return item?.County === '高雄市' || item?.County === '臺南市' || item?.County === '嘉義市' || item?.County === '嘉義縣' || item?.County === '屏東縣';
                                    else if (Region === '東部')
                                        return item?.County === '花蓮縣' || item?.County === '臺東縣';
                                    else if (Region === '離島')
                                        return item?.County === '澎湖縣' || item?.County === '金門縣' || item?.County === '連江縣';

                                })
                            }}
                            title={["顧客姓名", "門市營業時間",]} //必傳 title 與 colKeys 順序必需互相對應，否則名字跟資料欄會對錯
                            colKeys={["ShopName", "ShopDate",]} //必傳
                            // turnPageExecute={(executePages) => { execute(executePages, SearchWord) }}//暫不提供，因為沒用到 發查翻頁，必傳否則不能翻頁
                            theme={{
                                // basicContainer:{}, // 卡片最外層容器
                                // rowContainer: {}, // 卡片內每個資料列容器樣式，可在下方針對個別欄位複寫樣式
                                // rowTitle: {}, // 卡片內每個資料列中標題 不以renderTitle複寫時樣式
                                // rowContent: {}, // 卡片內每個資料列中標題 不以renderContent複寫時樣式
                                "ShopName": {
                                    // 提供客製化渲染內容，可使用預設參數 item 與 id，item 為 對應列表資料、id 為對應列表資料的id
                                    // renderTitle: (item, id) => (`${item} ${id} sdf`)
                                    width: "20%",
                                    renderTitle: (item, id) => ((item && null)),
                                    renderContent: (item, id, rowItem) => ((item &&
                                        <>
                                            <Text theme={{
                                                color: "#444",
                                                fontSize: "1.125rem",
                                                fontWeight: "900",
                                                width: '70%',
                                                display: 'inline-block'
                                            }}>{item}</Text>
                                            <Text theme={{
                                                color: "#444",
                                                fontSize: "1.125rem",
                                                fontWeight: "900",
                                                width: '30%',
                                                display: 'inline-block',
                                                textAlign: 'right'
                                            }}>{rowItem?.County}</Text>
                                            <Text
                                                style={{
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    WebkitLineClamp: 1,
                                                    width: "100%",
                                                    WebkitBoxOrient: "vertical",
                                                    whiteSpace: 'nowarp'
                                                }}
                                                theme={{
                                                    color: "#444",
                                                    fontSize: "1.125rem",
                                                    fontWeight: "400",
                                                    display: '-webkit-inline-box'
                                                }}>{`${rowItem?.County}${rowItem?.District}${rowItem?.Addr}`}</Text>
                                            <Text theme={{
                                                color: "#964f19",
                                                fontSize: "1.125rem",
                                                fontWeight: "500",
                                                display: 'block',
                                                height: '21px',
                                            }}>{!!rowItem?.ShopTel ? rowItem?.ShopTel : '  '}</Text>
                                            <EasyButton
                                                onClick={() => { console.log("立即預約") }}
                                                theme={{
                                                    backgroundColor: "#964f19",
                                                    display: "inline-block",
                                                    width: "100%",
                                                    height: "2.25rem",
                                                    lineHeight: "2.25rem",
                                                    color: "white",
                                                    //border: "1px solid #964f19",
                                                    borderRadius: "4px",
                                                    textAlign: "center",
                                                    hoverBackgroundColor: "#6d3f00",
                                                    hoverColor: "#fff",
                                                    fontSize: "0.875rem",
                                                    cursor: "pointer",
                                                }}
                                                text={"立即預約"}
                                            />
                                        </>
                                    ))
                                },
                                "ShopDate": {
                                    renderTitle: (item, id) => ((item &&
                                        <Text theme={{
                                            display: "block",
                                            margin: "0 0 0.375rem 0",
                                            color: "#999",
                                            fontSize: "0.75rem",
                                            fontWeight: "500"
                                        }}>{item}</Text>)),
                                    renderContent: (item, id, rowItem) => ((item &&
                                        <Container>
                                            <SubContainer theme={{ occupy: 6 }}>
                                                <Text theme={{
                                                    color: "#444",
                                                    fontSize: "1rem",
                                                    fontWeight: "400"
                                                }}>{`週一 ${rowItem?.ShopDate?.split(',')[0]}`}</Text>
                                            </SubContainer>
                                            <SubContainer theme={{ occupy: 6 }}>
                                                <Text theme={{
                                                    color: "#444",
                                                    fontSize: "1rem",
                                                    fontWeight: "400"
                                                }}>{`週六 ${rowItem?.ShopDate?.split(',')[5]}`}</Text>
                                            </SubContainer>
                                            <SubContainer theme={{ occupy: 6 }}>
                                                <Text theme={{
                                                    color: "#444",
                                                    fontSize: "1rem",
                                                    fontWeight: "400"
                                                }}>{`週二 ${rowItem?.ShopDate?.split(',')[1]}`}</Text>
                                            </SubContainer>
                                            <SubContainer theme={{ occupy: 6 }}>
                                                <Text theme={{
                                                    color: "#444",
                                                    fontSize: "1rem",
                                                    fontWeight: "400"
                                                }}>{`週日 ${rowItem?.ShopDate?.split(',')[6]}`}</Text>
                                            </SubContainer>
                                            <SubContainer theme={{ occupy: 6 }}>
                                                <Text theme={{
                                                    color: "#444",
                                                    fontSize: "1rem",
                                                    fontWeight: "400"
                                                }}>{`週三 ${rowItem?.ShopDate?.split(',')[2]}`}</Text>
                                            </SubContainer>
                                            <SubContainer theme={{ occupy: 6 }}>
                                                <Text theme={{
                                                    color: "#444",
                                                    fontSize: "1rem",
                                                    fontWeight: "400"
                                                }}>{' '}</Text>
                                            </SubContainer>
                                            <SubContainer theme={{ occupy: 6 }}>
                                                <Text theme={{
                                                    color: "#444",
                                                    fontSize: "1rem",
                                                    fontWeight: "400"
                                                }}>{`週四 ${rowItem?.ShopDate?.split(',')[3]}`}</Text>
                                            </SubContainer>
                                            <SubContainer theme={{ occupy: 6 }}>
                                                <Text theme={{
                                                    color: "#444",
                                                    fontSize: "1rem",
                                                    fontWeight: "400"
                                                }}>{' '}</Text>
                                            </SubContainer>
                                            <SubContainer theme={{ occupy: 6 }}>
                                                <Text theme={{
                                                    color: "#444",
                                                    fontSize: "1rem",
                                                    fontWeight: "400"
                                                }}>{`週五 ${rowItem?.ShopDate?.split(',')[4]}`}</Text>
                                            </SubContainer>
                                        </Container>
                                    ))
                                },

                                "controll": {
                                    width: "40%",
                                    rowContainer: {
                                        position: "absolute",
                                        top: "0.875rem",
                                        right: "0.2rem"
                                    },
                                    renderTitle: (item, id) => ((item && null)),
                                    renderContent: (item, id, rowItem) => {
                                        return (
                                            <BasicContainer theme={{
                                                textAlign: "right",
                                            }}>
                                                {[
                                                    <CreateIcon
                                                        key={`${item}1`}
                                                        style={{ cursor: "pointer", color: "#964f19", margin: "0 1rem 0 0" }}
                                                        onClick={() => { setEditAutoFill(rowItem); setOpenEditJumpDialog(true); }}
                                                    />,
                                                    <DeleteForeverIcon
                                                        key={`${item}2`}
                                                        style={{ cursor: "pointer", color: "#d25959", margin: "0 1rem 0 0" }}
                                                        onClick={() => { setOpenDelJumpDialog(true); setDelWho(rowItem.cRealName); IdResetValue(rowItem.Id) }}
                                                    />
                                                ]}
                                            </BasicContainer>
                                        )
                                    }
                                },
                            }}
                        />
                    </Container>
                </BasicContainer>
            </BasicContainer>
            }
            {/* 寬度小於768時渲染的組件 */}
            {width <= 768 && <BasicContainer theme={test.basicContainer}>


                <BasicContainer theme={test.tableBasicContainer}>

                    <ThemeProvider theme={overThemeLessThan768}>
                        <FormControl component="fieldset">
                            {/* <FormLabel component="legend">Gender</FormLabel> */}
                            <RadioGroup aria-label="gender" name="gender1" value={Region} onChange={handleChange} row>
                                <FormControlLabel value="北部" control={<Radio />} label="北部" />
                                <FormControlLabel value="中部" control={<Radio />} label="中部" />
                                <FormControlLabel value="南部" control={<Radio />} label="南部" />
                                <FormControlLabel value="東部" control={<Radio />} label="東部" />
                                <FormControlLabel value="離島" control={<Radio />} label="離島" />
                            </RadioGroup>
                        </FormControl>
                    </ThemeProvider>
                    <Container >
                        <CardTable
                            data={{
                                ...TableData, data: TableData?.data?.filter((item) => {
                                    if (Region === '北部')
                                        return item?.County === '臺北市' || item?.County === '新北市' || item?.County === '基隆市' || item?.County === '宜蘭縣' || item?.County === '桃園市' || item?.County === '新竹縣' || item?.County === '新竹市';
                                    else if (Region === '中部')
                                        return item?.County === '臺中市' || item?.County === '苗栗縣' || item?.County === '彰化縣' || item?.County === '南投縣' || item?.County === '雲林縣';
                                    else if (Region === '南部')
                                        return item?.County === '高雄市' || item?.County === '臺南市' || item?.County === '嘉義市' || item?.County === '嘉義縣' || item?.County === '屏東縣';
                                    else if (Region === '東部')
                                        return item?.County === '花蓮縣' || item?.County === '臺東縣';
                                    else if (Region === '離島')
                                        return item?.County === '澎湖縣' || item?.County === '金門縣' || item?.County === '連江縣';

                                })
                            }}
                            title={["顧客姓名", "門市營業時間",]} //必傳 title 與 colKeys 順序必需互相對應，否則名字跟資料欄會對錯
                            colKeys={["ShopName", "ShopDate",]} //必傳
                            // turnPageExecute={(executePages) => { execute(executePages, SearchWord) }}//暫不提供，因為沒用到 發查翻頁，必傳否則不能翻頁
                            theme={{
                                // basicContainer:{}, // 卡片最外層容器
                                // rowContainer: {}, // 卡片內每個資料列容器樣式，可在下方針對個別欄位複寫樣式
                                // rowTitle: {}, // 卡片內每個資料列中標題 不以renderTitle複寫時樣式
                                // rowContent: {}, // 卡片內每個資料列中標題 不以renderContent複寫時樣式
                                "ShopName": {
                                    // 提供客製化渲染內容，可使用預設參數 item 與 id，item 為 對應列表資料、id 為對應列表資料的id
                                    // renderTitle: (item, id) => (`${item} ${id} sdf`)
                                    width: "20%",
                                    renderTitle: (item, id) => ((item && null)),
                                    renderContent: (item, id, rowItem) => ((item &&
                                        <>
                                            <Text theme={{
                                                color: "#444",
                                                fontSize: "1.125rem",
                                                fontWeight: "900",
                                                width: '50%',
                                                display: 'inline-block'
                                            }}>{item}</Text>
                                            <Text theme={{
                                                color: "#444",
                                                fontSize: "1.125rem",
                                                fontWeight: "900",
                                                width: '50%',
                                                display: 'inline-block',
                                                textAlign: 'right'
                                            }}>{rowItem?.County}</Text>
                                            <Text theme={{
                                                color: "#444",
                                                fontSize: "1.125rem",
                                                fontWeight: "900",
                                                display: 'block'
                                            }}>{`${rowItem?.County}${rowItem?.District}${rowItem?.Addr}`}</Text>
                                            <Text theme={{
                                                color: "#964f19",
                                                fontSize: "1.125rem",
                                                fontWeight: "500",
                                                display: 'block',
                                                height: '21px',
                                            }}>{!!rowItem?.ShopTel ? rowItem?.ShopTel : '  '}</Text>
                                            <EasyButton
                                                onClick={() => { console.log("立即預約") }}
                                                theme={{
                                                    backgroundColor: "#964f19",
                                                    display: "inline-block",
                                                    width: "100%",
                                                    height: "2.25rem",
                                                    lineHeight: "2.25rem",
                                                    color: "white",
                                                    //border: "1px solid #964f19",
                                                    borderRadius: "4px",
                                                    textAlign: "center",
                                                    hoverBackgroundColor: "#6d3f00",
                                                    hoverColor: "#fff",
                                                    fontSize: "0.875rem",
                                                    cursor: "pointer",
                                                }}
                                                text={"立即預約"}
                                            />
                                        </>
                                    ))
                                },
                                "ShopDate": {
                                    renderTitle: (item, id, rowItem) => ((item &&
                                        <>
                                            {/* <Text theme={{
                                            display: "block",
                                            margin: "0 0 0.375rem 0",
                                            color: "#999",
                                            fontSize: "0.75rem",
                                            fontWeight: "500"
                                        }}>{item}</Text> */}
                                            <ThemeProvider theme={overTheme2}>
                                                < Accordion >
                                                    <AccordionSummary
                                                        expandIcon={<ExpandMoreIcon />}
                                                        aria-controls="panel1a-content"
                                                        id="panel1a-header"
                                                    >
                                                        <Typography className={classes.heading}>{item}</Typography>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <Container>
                                                            <SubContainer theme={{ occupy: 6 }}>
                                                                <Text theme={{
                                                                    color: "#444",
                                                                    fontSize: "1rem",
                                                                    fontWeight: "400"
                                                                }}>{`週一 ${rowItem?.ShopDate?.split(',')[0]}`}</Text>
                                                            </SubContainer>
                                                            <SubContainer theme={{ occupy: 6 }}>
                                                                <Text theme={{
                                                                    color: "#444",
                                                                    fontSize: "1rem",
                                                                    fontWeight: "400"
                                                                }}>{`週六 ${rowItem?.ShopDate?.split(',')[5]}`}</Text>
                                                            </SubContainer>
                                                            <SubContainer theme={{ occupy: 6 }}>
                                                                <Text theme={{
                                                                    color: "#444",
                                                                    fontSize: "1rem",
                                                                    fontWeight: "400"
                                                                }}>{`週二 ${rowItem?.ShopDate?.split(',')[1]}`}</Text>
                                                            </SubContainer>
                                                            <SubContainer theme={{ occupy: 6 }}>
                                                                <Text theme={{
                                                                    color: "#444",
                                                                    fontSize: "1rem",
                                                                    fontWeight: "400"
                                                                }}>{`週日 ${rowItem?.ShopDate?.split(',')[6]}`}</Text>
                                                            </SubContainer>
                                                            <SubContainer theme={{ occupy: 6 }}>
                                                                <Text theme={{
                                                                    color: "#444",
                                                                    fontSize: "1rem",
                                                                    fontWeight: "400"
                                                                }}>{`週三 ${rowItem?.ShopDate?.split(',')[2]}`}</Text>
                                                            </SubContainer>
                                                            <SubContainer theme={{ occupy: 6 }}>
                                                                <Text theme={{
                                                                    color: "#444",
                                                                    fontSize: "1rem",
                                                                    fontWeight: "400"
                                                                }}>{' '}</Text>
                                                            </SubContainer>
                                                            <SubContainer theme={{ occupy: 6 }}>
                                                                <Text theme={{
                                                                    color: "#444",
                                                                    fontSize: "1rem",
                                                                    fontWeight: "400"
                                                                }}>{`週四 ${rowItem?.ShopDate?.split(',')[3]}`}</Text>
                                                            </SubContainer>
                                                            <SubContainer theme={{ occupy: 6 }}>
                                                                <Text theme={{
                                                                    color: "#444",
                                                                    fontSize: "1rem",
                                                                    fontWeight: "400"
                                                                }}>{' '}</Text>
                                                            </SubContainer>
                                                            <SubContainer theme={{ occupy: 6 }}>
                                                                <Text theme={{
                                                                    color: "#444",
                                                                    fontSize: "1rem",
                                                                    fontWeight: "400"
                                                                }}>{`週五 ${rowItem?.ShopDate?.split(',')[4]}`}</Text>
                                                            </SubContainer>
                                                        </Container>
                                                    </AccordionDetails>
                                                </Accordion>
                                            </ThemeProvider>
                                        </>
                                    )),
                                    renderContent: (item, id, rowItem) => ((false &&
                                        <Container>
                                            <SubContainer theme={{ occupy: 6 }}>
                                                <Text theme={{
                                                    color: "#444",
                                                    fontSize: "1rem",
                                                    fontWeight: "400"
                                                }}>{`週一 ${rowItem?.ShopDate?.split(',')[0]}`}</Text>
                                            </SubContainer>
                                            <SubContainer theme={{ occupy: 6 }}>
                                                <Text theme={{
                                                    color: "#444",
                                                    fontSize: "1rem",
                                                    fontWeight: "400"
                                                }}>{`週六 ${rowItem?.ShopDate?.split(',')[5]}`}</Text>
                                            </SubContainer>
                                            <SubContainer theme={{ occupy: 6 }}>
                                                <Text theme={{
                                                    color: "#444",
                                                    fontSize: "1rem",
                                                    fontWeight: "400"
                                                }}>{`週二 ${rowItem?.ShopDate?.split(',')[1]}`}</Text>
                                            </SubContainer>
                                            <SubContainer theme={{ occupy: 6 }}>
                                                <Text theme={{
                                                    color: "#444",
                                                    fontSize: "1rem",
                                                    fontWeight: "400"
                                                }}>{`週日 ${rowItem?.ShopDate?.split(',')[6]}`}</Text>
                                            </SubContainer>
                                            <SubContainer theme={{ occupy: 6 }}>
                                                <Text theme={{
                                                    color: "#444",
                                                    fontSize: "1rem",
                                                    fontWeight: "400"
                                                }}>{`週三 ${rowItem?.ShopDate?.split(',')[2]}`}</Text>
                                            </SubContainer>
                                            <SubContainer theme={{ occupy: 6 }}>
                                                <Text theme={{
                                                    color: "#444",
                                                    fontSize: "1rem",
                                                    fontWeight: "400"
                                                }}>{' '}</Text>
                                            </SubContainer>
                                            <SubContainer theme={{ occupy: 6 }}>
                                                <Text theme={{
                                                    color: "#444",
                                                    fontSize: "1rem",
                                                    fontWeight: "400"
                                                }}>{`週四 ${rowItem?.ShopDate?.split(',')[3]}`}</Text>
                                            </SubContainer>
                                            <SubContainer theme={{ occupy: 6 }}>
                                                <Text theme={{
                                                    color: "#444",
                                                    fontSize: "1rem",
                                                    fontWeight: "400"
                                                }}>{' '}</Text>
                                            </SubContainer>
                                            <SubContainer theme={{ occupy: 6 }}>
                                                <Text theme={{
                                                    color: "#444",
                                                    fontSize: "1rem",
                                                    fontWeight: "400"
                                                }}>{`週五 ${rowItem?.ShopDate?.split(',')[4]}`}</Text>
                                            </SubContainer>
                                        </Container>
                                    ))
                                },

                                "controll": {
                                    width: "40%",
                                    rowContainer: {
                                        position: "absolute",
                                        top: "0.875rem",
                                        right: "0.2rem"
                                    },
                                    renderTitle: (item, id) => ((item && null)),
                                    renderContent: (item, id, rowItem) => {
                                        return (
                                            <BasicContainer theme={{
                                                textAlign: "right",
                                            }}>
                                                {[
                                                    <CreateIcon
                                                        key={`${item}1`}
                                                        style={{ cursor: "pointer", color: "#964f19", margin: "0 1rem 0 0" }}
                                                        onClick={() => { setEditAutoFill(rowItem); setOpenEditJumpDialog(true); }}
                                                    />,
                                                    <DeleteForeverIcon
                                                        key={`${item}2`}
                                                        style={{ cursor: "pointer", color: "#d25959", margin: "0 1rem 0 0" }}
                                                        onClick={() => { setOpenDelJumpDialog(true); setDelWho(rowItem.cRealName); IdResetValue(rowItem.Id) }}
                                                    />
                                                ]}
                                            </BasicContainer>
                                        )
                                    }
                                },
                            }}
                        />
                    </Container>
                </BasicContainer>
            </BasicContainer>
            }


        </>
    )
}