import { createTheme } from "@mui/material";
export const LightTheme = createTheme({
    palette: {
        mode: 'light',
        background: {
            default: "#f4f7fc",
            paper: '#fff'
        },
        primary: {
            main: '#260C1A',
            light: '#F7F7F2'
        },
        secondary: {
            main: '#dcfbfc'
        },
        info: {
            main: '#1A73E8'
        },
        success: {
            main: '#53DCA2'
        },
        warning: {
            main: "#5F34F5"
        },
        error: {
            main: "#F05D23"
        },

    },
    shape: {
        borderRadius: 6
    },
    typography: {
        htmlFontSize: 19,
        fontFamily: ['Nunito', 'sans - serif'],
        h1: {
            fontFamily: 'Montserrat',
            fontWeight: 600,
        },
        h2: {
            fontFamily: 'Montserrat',
            fontWeight: 'bold'
        },
        h3: {
            fontFamily: 'Montserrat',
            fontWeight: 'bold'
        },
        h4: {
            fontFamily: 'Montserrat',
            fontWeight: 'bold'
        },
        h5: {
            fontFamily: 'Montserrat',
            fontWeight: 'bold'
        },
        h6: {
            fontFamily: 'Montserrat',
            fontWeight: 'bold',
            fontSize: '1em'
        },
        body2: {

        },
        subtitle1: {

            letterSpacing: '0.09098em'
        },
        subtitle2: {

            // letterSpacing: '0.09098em',
            fontSize: '1.1em',
            fontWeight: 'bold'
        }
    },
    mixins: {
        toolbar: {
            minHeight: 50
        },
    },
    components: {
        MuiTab: {
            styleOverrides: {
                root: {
                    "&.Mui-selected": {
                        backgroundColor: '#53DCA2',
                        color: '#fff',
                        borderRadius: "10px"

                    },
                    backgroundColor: '#fff',
                    color: '#000',
                    borderRadius: '10px',
                    margin: '2px',
                    border: '0.5px solid gray',
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "capitalize"
                }
            }
        }

    }

})


export const DarkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: "rgb(28, 14, 49)",
        },
        primary: {
            main: '#F7F7F2'
        },
        secondary: {
            main: '#EFD345'
        },
        info: {
            main: '#F4991A'
        },
        success: {
            main: '#1363DF'
        },
        warning: {
            main: '#A10035'
        },
        error: {
            main: "#4B56D2"
        }
    },
    shape: {
        borderRadius: 12
    },
    typography: {
        // htmlFontSize: 16,
        h1: {
            fontSize: '4.8rem',
            fontWeight: 600,
        },
        h4: {

        },
        body2: {

        },
        subtitle1: {

            letterSpacing: '0.09098em'
        },
        subtitle2: {

            letterSpacing: '0.09098em',
            fontWeight: 'bold'
        }
    },
    mixins: {
        toolbar: {
            minHeight: 50
        }
    }
})