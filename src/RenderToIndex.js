import App from './App';
const RenderToIndex = () => {
  return (
    <div>
      <div id="pageloader-overlay" class="visible incoming">
        <div class="loader-wrapper-outer">
          <div class="loader-wrapper-inner">
            <div class="loader"></div>
          </div>
        </div>
      </div>
      <div id="wrapper">
        <div class="fixedtop">
          <App /> 
          <div id="workdesk"></div>
        </div>
        {/* <div class="clearfix"></div> */}
      </div>
    </div>
  );
};

export default RenderToIndex;
