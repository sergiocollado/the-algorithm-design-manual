"use strict";

var IndexedPriorityQueue = require("../03-data-structures/IndexedPriorityQueue.js");

/**
 * Dijkstra algorithm
 * Requirements: positive weighted directed graph
 * Computes on initialization the Shortest Path Tree from given source, can be queried with the to() method to get
 * shortest path to a vertex in linear time
 *
 * At each step, selects the nearest node on a directed path from source and relaxes it.
 * Relaxing a node means analyzing the nodes reachable from it, inserting new reachable nodes in the priority queue, and
 * updating the cost of reaching a node already in the priority queue if a shorter route is found.
 * Every time we relax a node, we have the guarantee of having found the shortest path from source to it.
 */
module.exports = function(graph, source) {

    var edge_to_source = {};
    var distance_to_source = {};
    var pq = new IndexedPriorityQueue();

    pq.insert(0, 0);

    var vertexes_count = graph.getVertexesCount();
    for (var i=0; i<vertexes_count; i++) {
        distance_to_source[i] = Number.POSITIVE_INFINITY;
    }
    distance_to_source[source] = 0;

    function relax(edge) {
        var from = edge.from();
        var to = edge.to();
        var candidate_distance = distance_to_source[from] + edge.weight;
        if (distance_to_source[to] > candidate_distance) {
            distance_to_source[to] = candidate_distance;
            edge_to_source[to] = from;
            if (pq.contains(to)) {
                pq.update(to, candidate_distance);
            } else {
                pq.insert(to, candidate_distance);
            }
        }
    }

    var next;

    while (!pq.empty()) {
        next = pq.get();
        var adjacents = graph.getAdjacents(next.id);
        adjacents.forEach(function(adjacent) {
            relax(adjacent);
        });
    }

    this.to = function to(node) {
        var path = [node];
        var tmp_node = node;
        while (edge_to_source[tmp_node] !== undefined) {
            path.unshift(edge_to_source[tmp_node]);
            tmp_node = edge_to_source[tmp_node];
        }
        return {
            distance: distance_to_source[node],
            path: path
        };
    };

};