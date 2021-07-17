import React  from "react";
import clsx from "clsx";
import PropTypes from 'prop-types';
import SvgIcon from '@material-ui/core/SvgIcon';
import { alpha } from '@material-ui/core/styles';
import {makeStyles, withStyles} from '@material-ui/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Draggable from 'react-draggable';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import Collapse from '@material-ui/core/Collapse';
import { useSpring, animated } from 'react-spring/dist/react-spring.cjs'; // web.cjs is required for IE 11 support


function MinusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
}

function PlusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  );
}

function CloseSquare(props) {
  return (
    <SvgIcon className="close" fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
    </SvgIcon>
  );
}

function TransitionComponent(props) {
  const style = useSpring({
    from: { opacity: 0, transform: 'translate3d(20px,0,0)' },
    to: { opacity: props.in ? 1 : 0, transform: `translate3d(${props.in ? 0 : 20}px,0,0)` },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

TransitionComponent.propTypes = {
  /**
   * Show the component; triggers the enter or exit states
   */
  in: PropTypes.bool,
};

const StyledTreeItem = withStyles((theme) => ({
  iconContainer: {
    '& .close': {
      opacity: 0.3,
    },
  },
  group: {
    marginLeft: 7,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha('#000', 0.4)}`,
  },
}))((props) => <TreeItem {...props} TransitionComponent={TransitionComponent} />);


const useStyles = makeStyles((theme) => ({
root: {
  // with: '100vw',
  // height: '100vh',
  margin: 0,
  height: '100vh',
  color: '#FFF',
  flexGrow: 1,
  maxWidth: 400,
  padding: 0,
  overflow: 'hidden',
  background: '#041830',
},
list: {
  width: 250,
},
fullList: {
  width: 'auto',
},
}));
const Layers = ({toggleDrawer}) => {
  const classes= useStyles();
  const anchor = "left";

  return (
    <ClickAwayListener onClickAway={() => toggleDrawer("left", false)}>
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      //onClick={toggleDrawer(anchor, false)}
      //onKeyDown={toggleDrawer(anchor, false)}
    >
    <TreeView
      className={classes.root}
      defaultExpanded={['1']}
      defaultCollapseIcon={<MinusSquare />}
      defaultExpandIcon={<PlusSquare />}
      defaultEndIcon={<CloseSquare />}
    >
      <StyledTreeItem  nodeId="1" label="Layers">
        <Draggable handle="#Lights" cancel={'[class*="MuiTreeItem-content"]'}>
          <StyledTreeItem id="Lights" draggable={"true"} nodeId="2" label="Lights" />
        </Draggable>
        <Draggable handle="#Cameras" cancel={'[class*="MuiTreeItem-content"]'}>
          <StyledTreeItem id="Cameras" draggable={"true"} nodeId="3" label="Cameras">
            <StyledTreeItem draggable={"true"} nodeId="6" label="Default" />
            <StyledTreeItem draggable={"true"} nodeId="7" label="Perpective">
              <StyledTreeItem draggable={"true"} nodeId="9" label="Child 1" />
              <StyledTreeItem draggable={"true"} nodeId="10" label="Child 2" />
              <StyledTreeItem draggable={"true"} nodeId="11" label="Child 3" />
            </StyledTreeItem>
          </StyledTreeItem>
        </Draggable>
        <Draggable handle="#Object 1" cancel={'[class*="MuiTreeItem-content"]'}>
          <StyledTreeItem id ="Object 1" draggable={"true"} nodeId="8" label="Object 1" />
        </Draggable>
        <Draggable handle="Object 2" cancel={'[class*="MuiTreeItem-content"]'}>
        <StyledTreeItem id="Object 2" draggable={"true"} nodeId="4" label="Object 2" />
        </Draggable>
        <Draggable handle="#Object 3" cancel={'[class*="MuiTreeItem-content"]'}>
        <StyledTreeItem id="Object 3" draggable={"true"} nodeId="5" label="Object 3" />
        </Draggable>
      </StyledTreeItem>
    </TreeView>
    </div>
  </ClickAwayListener>
  )
}
export default Layers;
