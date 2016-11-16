import { getMuiTheme } from "material-ui/styles";
import { amber100, amber500, amber700, amber900 } from "material-ui/styles/colors";

export const muiThemeOptions = getMuiTheme({
    // fontFamily: "Charlotte Sans, sans-serif, Siddhanta",
    palette: {
        primary1Color: amber500,
        primary2Color: amber700,
        primary3Color: amber100,
        accent1Color: amber900,
        pickerHeaderColor: amber700
    }
});
