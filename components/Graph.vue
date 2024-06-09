<template>
  <div class="control-panel">
    <select @change="updateLayout($event.target.value)" class="bg-blue-500 text-white font-bold py-2 px-4 rounded">
        <option value="LR">Layout: Left to Right</option>
        <option value="TB">Layout: Top to Bottom</option>
    </select>
</div>

  <v-network-graph
    ref="graph"
    class="graph"
    :nodes="nodes"
    :edges="edges"
    :layouts="layouts"
    :configs="configs"
  />
</template>

<script setup lang="ts">
import { onMounted, watchEffect, ref, reactive } from "vue";
import * as vNG from "v-network-graph";
import "v-network-graph/lib/style.css";
//@ts-ignore
import dagre from "dagre/dist/dagre.min.js"

const nodeSize = 40

const configs = vNG.defineConfigs({
  view: {
    autoPanAndZoomOnLoad: "fit-content",
    onBeforeInitialDisplay: () => layout("TB"),
  },
  node: {
    normal: { radius: nodeSize / 2 },
    label: { direction: "center", color: "#fff" },
  },
  edge: {
    normal: {
      color: "#aaa",
      width: 3,
    },
    margin: 4,
    marker: {
      target: {
        type: "arrow",
        width: 4,
        height: 4,
      },
    },
  },
})

const layouts = reactive({
  nodes: {},
})

const graph = ref<vNG.VNetworkGraphInstance>()

function layout(direction: "TB" | "LR") {
  if (Object.keys(nodes).length <= 1 || Object.keys(edges).length == 0) {
    return
  }

  // convert graph
  // ref: https://github.com/dagrejs/dagre/wiki
  const g = new dagre.graphlib.Graph()
  // Set an object for the graph label
  g.setGraph({
    rankdir: direction,
    nodesep: nodeSize * 2,
    edgesep: nodeSize,
    ranksep: nodeSize * 2,
  })
  // Default to assigning a new object as a label for each new edge.
  g.setDefaultEdgeLabel(() => ({}))

  // Add nodes to the graph. The first argument is the node id. The second is
  // metadata about the node. In this case we're going to add labels to each of
  // our nodes.
  Object.entries(nodes).forEach(([nodeId, node]) => {
    g.setNode(nodeId, { label: node.name, width: nodeSize, height: nodeSize })
  })

  // Add edges to the graph.
  Object.values(edges).forEach(edge => {
    g.setEdge(edge.source, edge.target)
  })

  dagre.layout(g)

  g.nodes().forEach((nodeId: string) => {
    // update node position
    const x = g.node(nodeId).x
    const y = g.node(nodeId).y
    layouts.nodes[nodeId] = { x, y }
  })
}

function updateLayout(direction: "TB" | "LR") {
  // Animates the movement of an element.
  graph.value?.transitionWhile(() => {
    layout(direction)
  })
}

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
  layout("LR");
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
          xnodes[src] = { name: src.replace(/{{/g, "{").replace(/}}/g, "}") };
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
