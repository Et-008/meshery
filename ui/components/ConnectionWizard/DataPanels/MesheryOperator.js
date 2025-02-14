/* eslint-disable react/display-name */
/* eslint-disable  no-unused-vars*/
import CloseIcon from "@material-ui/icons/Close";
import {
  withStyles,
  Grid,
  Chip,
  IconButton,
  List,
  Paper,
} from "@material-ui/core/";
import { withSnackbar } from "notistack";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { updateProgress } from "../../../lib/store";
import { pingMesheryOperator, pingMesheryOperatorWithNotification } from "../helpers/mesheryOperator";
import fetchMesheryOperatorStatus from "../../graphql/queries/OperatorStatusQuery";
import AdapterChip from "./AdapterChip"
import { closeButtonForSnackbarAction, errorHandlerGenerator,successHandlerGenerator } from "../helpers/common"


const chipStyles = (theme) => ({ chipIcon : { width : theme.spacing(2.5) },
  chip : { marginRight : theme.spacing(1),
    marginBottom : theme.spacing(1), }, })









const MesheryOperatorDataPanel = ({
  operatorInformation, updateProgress, enqueueSnackbar, closeSnackbar
}) => {

  const handleMesheryOperatorClick = () => {

    const successCb = (res) => {
      if (res?.operator?.status == "ENABLED") {
        enqueueSnackbar('Operator was successfully pinged!', { variant : 'success',
          autoHideDuration : 2000,
          action : closeButtonForSnackbarAction(closeSnackbar) })
      } else {
        enqueueSnackbar('Operator was not successfully pinged!', { variant : 'failure',
          autoHideDuration : 2000,
          action : closeButtonForSnackbarAction(closeSnackbar) })
      }
    }

    const errorCb = (err) => {
      enqueueSnackbar('Unable to ping meshery operator!'+err, { variant : 'error',
        autoHideDuration : 2000,
        action : closeButtonForSnackbarAction(closeSnackbar) })
    }


    pingMesheryOperator(
      fetchMesheryOperatorStatus,
      successCb,
      errorCb
    )

  }


  return (
    <Paper style={{ padding : "2rem" }}>
      <AdapterChip
        handleClick={handleMesheryOperatorClick}
        isActive={true}
        image="/static/img/meshery-operator.svg"
        label="Meshery Operator"
      />
      <Grid container spacing={1}>
        <Grid item xs={12} md={4}>
          <List>
            <ListItem>
              <ListItemText primary="Operator State" secondary={operatorInformation.operatorInstalled
                ? "Active"
                : "Disabled"} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Operator Version" secondary={operatorInformation.operatorVersion} />
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={12} md={4}>
          <List>
            <ListItem>
              <ListItemText primary="MeshSync State" secondary={operatorInformation.meshSyncInstalled
                ? "Active"
                : "Disabled"} />
            </ListItem>
            <ListItem>
              <ListItemText primary="MeshSync Version" secondary={operatorInformation.meshSyncVersion} />
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={12} md={4}>
          <List>
            <ListItem>
              <ListItemText primary="NATS State" secondary={operatorInformation.NATSInstalled
                ? "Active"
                : "Disabled"} />
            </ListItem>
            <ListItem>
              <ListItemText primary="NATS Version" secondary={operatorInformation.NATSVersion} />
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </Paper>
  )
}


const mapDispatchToProps = (dispatch) => ({ updateProgress : bindActionCreators(updateProgress, dispatch), });

export default connect(null, mapDispatchToProps)(withSnackbar(MesheryOperatorDataPanel))
