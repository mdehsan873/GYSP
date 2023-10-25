import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { FormLabel, Grid, Input, Stack, Typography } from '@mui/material';
import Loader from '../../components/Loader';
import { useState, useEffect } from 'react';
import secureLocalStorage from "react-secure-storage";
import AxiosObj from '../../axios/AxiosObj';
import { FormControl } from '@mui/material';
import { Select} from '@mui/material';
import { MenuItem } from '@mui/material';
import { toast } from 'react-toastify';
import { useSelector } from "react-redux";
import SearchIcon from "@mui/icons-material/Search";

import {
    ListSubheader,
    TextField,
    InputAdornment
} from "@mui/material";

export default function AssignClass({ open, setOpen, data }) {
    const { classAndSection, sessions } = useSelector(state => state.infra)

    const [teacher_id, setTeacherId] = useState('')

    const [seclectedClassItemID, setSeclectedClassItemID] = useState('')
    const [teacherName, setTeacherName] = useState('')
    const [classSectionRAW, setClassSectionRAW] = useState([])

    const [classSectionSessionFilter, setClassSectionSessionFilter] = useState('');
    const [isChange, setIsChange] = useState(false)

    const [errorMsg, setErrorMsg] = useState('')

    const [loading, setLoading] = useState(false)
    const handleClose = () => {
        setErrorMsg('')
        setTeacherId('')
        setClassSectionSessionFilter('')
        setSeclectedClassItemID('')
        setTeacherName('')
        setIsChange(false)
        setLoading(false)
        setOpen(false);
    };
    const capitalizeWords = (str) => {
        return str
            .toLowerCase()
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };
    const assignClass = async () => {

        if (!teacher_id || seclectedClassItemID === "" || seclectedClassItemID == "0") {
            setErrorMsg("Fill required field")
            toast.error("Fill required field");
            return;
        }

        const foundItem = await classAndSection.find(item => item.id === seclectedClassItemID);
        if (foundItem) {
            let data = JSON.stringify({
                "class_id": foundItem.class_id,
                "section_id": foundItem.section_id,
                "teacher_id": teacher_id,
            });
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'teacher/assign/class/teacher/',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + secureLocalStorage.getItem('access'),  
                },
                data: data
            };

            AxiosObj.request(config)
                .then((response) => {
                    if (response.data?.Success) {
                        toast.success(capitalizeWords(response.data?.Data) || "Class Has been Assigned");
                        if (secureLocalStorage.getItem("teacherRAWData")) {
                            secureLocalStorage.removeItem("teacherRAWData")
                        }
                        // Reload the window after 2 seconds
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    } else {
                        toast.error(capitalizeWords(response.data?.Data) || "Something went wrong...!");
                    }
                })
                .catch((e) => {
                    try {
                        e.response.data?.Data.map(item => (
                            toast.error(capitalizeWords(item) || "Something went wrong...!")
                        ))
                    } catch (e) {
                        toast.error(capitalizeWords(e.response.data?.Data) || "Something went wrong...!")
                    }
                })
                .finally(() => setLoading(false));
        }
    }

    const handleChangeValue = (e) => {
        setIsChange(true);
        const { name, value } = e.target;
        e.stopPropagation();

        if (name === "classSection") {
            setSeclectedClassItemID(value);
        }

    };
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        let filteredClass = classAndSection.filter((classSectionItem) => {
            const classMatch = 'all' ;

            const nameMatch =
                searchText.trim() === '' ||
                classSectionItem.class_name.toLowerCase().includes(searchText.toLowerCase().trim()) ||
                classSectionItem.section_name.toLowerCase().includes(searchText.toLowerCase().trim()) ||
                `${classSectionItem.class_name} ${classSectionItem.section_name}`
                    .toLowerCase()
                    .includes(searchText.toLowerCase().trim());
            return nameMatch && classMatch;
        });

        setClassSectionRAW(filteredClass);

    }, [searchText, classSectionSessionFilter]);

    useEffect(() => {
        if (open === true) {
            if (data.classSec !== null) {
                const foundItem = classAndSection.find(item => item.class_name === data.classSec.class_name && item.section_name === data.classSec.section);
                if (foundItem) {
                    setSeclectedClassItemID(foundItem.id)
                } else {
                    setSeclectedClassItemID('')
                }
            } else {
                setSeclectedClassItemID('0')
            }
            setTeacherId(data?.id)
            setTeacherName(data?.name)
            // setClassSectionRAW(classAndSection)
        }
    }, [data, open]);

    useEffect(() => {
        setClassSectionSessionFilter(sessions[0].name)
    }, [sessions, open]);

    // Handle Filter change
    const handleFilterChange = async (e) => {
        setIsChange(true)
        const { name, value } = e.target;
        // Class Section
        if (name === "classSectionSession") {
            setClassSectionSessionFilter(value);
        }
    }

    const handleChangeValue2 = (event) => {
        setIsChange(true)
        setSeclectedClassItemID(event.target.value);
    };

    const handleSearchTextChange = (event) => {
        setSearchText(event.target.value);
    };

    const handleSelectKeyDown = (event) => {
        if (event.key !== 'Escape') {
            // Prevents autoselecting item while typing (default Select behavior)
            event.stopPropagation();
        }
        event.stopPropagation();
    };

    const handleSearchInputKeyDown = (event) => {
        if (event.key !== 'Escape') {
            // Prevents autoselecting item while typing (default Select behavior)
            event.stopPropagation();
        }
        event.stopPropagation();
    };

    const handleSelectClick = (event) => {
        if (event.key !== 'Escape') {
            // Prevents autoselecting item while typing (default Select behavior)
            event.stopPropagation();
        }
        event.stopPropagation();
    };

    const handleSearchInputClick = (event) => {
        // Prevents autoselecting item while typing (default Select behavior)
        event.stopPropagation();
    };

    return (
        <div>
            <Dialog maxWidth='sm' fullWidth open={open} onClose={handleClose} >
                <DialogTitle variant='h5' >Assign Class To Teachers</DialogTitle>
                <DialogContent >
                    <form>
                        <Grid container spacing={1} justifyContent='center' alignItems={'center'}>
                            {/* <Grid item lg={4} sm={12}>
                                <Stack margin={2}>
                                    <FormLabel>Session*</FormLabel>
                                    <FormControl variant="standard" sx={{ width: '100%' }}>
                                        <Select
                                            labelId="classSectionSession-simple-select-standard-label"
                                            id="classSectionSession-simple-select-standard"
                                            value={classSectionSessionFilter}
                                            name="classSectionSession"
                                            onChange={handleFilterChange}
                                            style={{ marginTop: 0, fontWeight: 600, fontSize: '12px', color: "#03014c", opacity: "0.5", letterSpacing: "0.5px" }}
                                            label="classSectionSession"
                                        >
                                            {sessions.map((item) => (
                                                <MenuItem key={item.id} value={item?.name}>
                                                    {item?.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Stack>
                            </Grid> */}
                            <Grid item lg={4} sm={12}>
                                <Stack margin={2}>
                                    <FormLabel>Class*</FormLabel>
                                    <FormControl variant="standard" sx={{ width: '100%' }}>
                                        <Select
                                            labelId="search-select-label"
                                            id="search-select"
                                            value={seclectedClassItemID}
                                            onChange={handleChangeValue2}
                                            name="classSection"
                                            label="classSection"
                                            onKeyDown={handleSelectKeyDown}
                                            onClick={handleSelectClick}
                                            MenuProps={{
                                                getContentAnchorEl: null,
                                            }}
                                        >
                                            <ListSubheader>
                                                <TextField
                                                    size="small"
                                                    autoFocus
                                                    placeholder="Type to search..."
                                                    fullWidth
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <SearchIcon />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    value={searchText}
                                                    onChange={handleSearchTextChange}
                                                    onKeyDown={handleSearchInputKeyDown}
                                                    onClick={handleSearchInputClick}
                                                />
                                            </ListSubheader>
                                            <MenuItem disabled={true} value={'0'}>
                                                Select the class
                                            </MenuItem>
                                            {classSectionRAW.map((item) => (
                                                <MenuItem key={item.id} value={item.id}>
                                                    {(item?.class_name + ' ' + item?.section_name).toUpperCase()}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Stack>
                            </Grid>
                            <Grid item lg={8} sm={12}>
                                <Stack margin={2}>
                                    <FormLabel>Teacher's Name</FormLabel>
                                    <Input required value={teacherName} disabled />
                                </Stack>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
                <Typography color={'red'} textAlign={'center'}>{errorMsg !== '' ? errorMsg : null}</Typography>
                {loading ? <Loader /> : <Button disabled={!isChange} variant='contained' color='warning' sx={{ padding: 1.5, paddingRight: 6, paddingLeft: 6, margin: 'auto', width: 'fit-content', }} onClick={assignClass} >Assign</Button>}
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
