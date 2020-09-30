import React, { memo } from "react";
import { Dustbin } from "./FieldsGroupBox";
import { Box } from "./Box";
export const Container = memo(function Container() {
    const data = [{
        title: "Node 1",
        // childNodes: [
        //   { title: "Childnode 1.1" },
        //   {
        //     title: "Childnode 1.2",
        //     childNodes: [
        //       {
        //         title: "Childnode 1.2.1",
           
        //       }
        //     ]
        //   }
        // ]
      }];

  const Tree = ({data}) => ( 
    <Dustbin title={data}>
      {data && data.map(item => (
        <div>
          {item.childNodes && <Tree data={item.childNodes} />}
        </div>
      ))}
     </Dustbin>
  );

  return (
    <div>
      <div style={{ overflow: "hidden", clear: "both" }}>
      <Tree data={data} />
      </div>
    </div>
  );
});

export default Container;
