import React, { useEffect, useState } from "react";
import { ReactFlow, Controls, Background, Handle } from "@xyflow/react";
import { Tooltip } from "@mui/material"; // If using MUI
import "@xyflow/react/dist/style.css";
import moment from "moment";
import { useSelector } from "react-redux";
import PageTitle from "../common/PageTitle";

// const blockchain = [
//   { id: "1", previous_hash: "0000", hash: "a1b2c3", timestamp: "10:00 AM" },
//   { id: "2", previous_hash: "a1b2c3", hash: "d4e5f6", timestamp: "10:05 AM" },
//   { id: "3", previous_hash: "d4e5f6", hash: "g7h8i9", timestamp: "10:10 AM" },
// ];

const BlockNode = ({ data }) => {
  return (
    <div className="p-4 border-2 border-gray-600 bg-white rounded-lg shadow-md">
      <p className="text-sm font-bold">Block #{data.id}</p>
      <p className="text-xs truncate w-40 overflow-hidden">
        Prev:
        <Tooltip title={data["previousHash"]}>
          <span className="cursor-pointer">
            {data["previousHash"].slice(0, 12)}...
          </span>
        </Tooltip>
      </p>
      <p className="text-xs truncate w-60 overflow-hidden">
        Hash:
        <Tooltip title={data.hash}>
          <span className="cursor-pointer">{data.hash.slice(0, 12)}...</span>
        </Tooltip>
      </p>
      <p className="text-xs">
        Time: {moment.unix(data.timestamp).format("DD-MM-YYYY hh:mm A")}
      </p>
      <p className="text-xs truncate w-40 overflow-hidden">
        Data:
        <Tooltip title={data.data}>
          <span className="cursor-pointer">{data.data.slice(0, 12)}...</span>
        </Tooltip>
      </p>
      <Handle type="target" position="left" />
      <Handle type="source" position="right" />
    </div>
  );
};

const BlockchainFlow = () => {
  const token = useSelector((state) => state.user.token);
  const [blockchain, setBlockchain] = useState([]);

  useEffect(() => {
    fetchBlocks();
  }, []);

  const fetchBlocks = async () => {
    const response = await fetch("http://localhost:3000/api/blocks/", {
      headers: {
        Authorization: token,
      },
    });

    const res = await response.json();
    const blocks = res.map((item, id) => ({
      id: item._id.toString(),
      ...item,
    }));

    setBlockchain(blocks);
  };

  const nodes = blockchain.map((block, index) => {
    return {
      id: block.id,
      type: "customBlock",
      position: { x: index * 400, y: 100 },
      data: block,
    };
  });

  const edges = blockchain.slice(1).map((block, index) => ({
    id: `e${index + 1}`,
    source: blockchain[index].id,
    target: block.id,
    type: "default",
    animated: true,
  }));

  return (
    <div className="p-6 flex flex-col gap-8 h-[100%]">
      <PageTitle title="Blockchain" />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={{ customBlock: BlockNode }}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default BlockchainFlow;
