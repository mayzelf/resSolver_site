<template>
  <v-network-graph
    class="graph dark:bg-gray-800 dark:text-white"
    :nodes="nodes"
    :edges="edges"
  />
</template>

<script setup lang="ts">
import { onMounted, watchEffect, ref } from "vue";
import { VNetworkGraph } from "v-network-graph";
import "v-network-graph/lib/style.css";

const props = defineProps({
  result: Object,
});

const result = ref(props.result);

let nodes = {
  node1: { name: "Node 1" },
  node2: { name: "Node 2" },
  node3: { name: "Node 3" },
  node4: { name: "Node 4" },
};

let edges = {
  edge1: { source: "node1", target: "node2" },
  edge2: { source: "node2", target: "node3" },
  edge3: { source: "node3", target: "node4" },
};


watchEffect(() => {
  let graphData;
  if (Array.isArray(props.result)) {
    graphData = generateGraphData(props.result);
  } else {
    graphData = generateGraphData([]);
  }
  console.log(graphData);

  nodes = graphData.xnodes;
  edges = graphData.xedges;
});

function generateGraphData(result: string[]) {
  let xnodes: { [key: string]: { name: string } } = {};
  let xedges: { id: string; source: string; target: string }[] = [];
  let xedgeId = 1;

  // First, create all nodes
  result.forEach((item: string) => {
    if (!item.includes("==>")) {
      // This is a node
      if (!xnodes[item]) {
        xnodes[item] = { name: item };
      }
    } else {
      // This is an edge
      const [source, target] = item.split(" ==> ");
      const sources = source.match(/\{[^}]+\}/g) || []; // Extract all source nodes

      // Add the target as a new node
      if (!xnodes[target]) {
        xnodes[target] = { name: target };
      }

      // Add the source nodes as new nodes
      sources.forEach((src) => {
        if (!xnodes[src]) {
          xnodes[src] = { name: src };
        }
      });
    }
  });

  // Then, create all edges
  result.forEach((item: string) => {
    if (item.includes("==>")) {
      // This is an edge
      const [source, target] = item.split(" ==> ");
      const sources = source.match(/\{[^}]+\}/g) || []; // Extract all source nodes

      // Add edges from each source to the target
      sources.forEach((src) => {
        if (xnodes[src] && xnodes[target]) {
          xedges.push({
            id: `edge${xedgeId++}`,
            source: src,
            target: xnodes[target].name,
          });
        }
      });
    }
  });

  return { xnodes, xedges };
}
</script>

<style>
.graph {
  width: 800px;
  height: 600px;
}
</style>
