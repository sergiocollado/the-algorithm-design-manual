"use strict";

var TopologicalSort = require("../05-graph-traversal/TopologicalSort.js");

/**
 * Directed Acyclic Graph Shortest Path Tree algorithm
 * Requirements: weighted directed acyclic graph
 * Computes on initialization the Shortest Path Tree from given source, can be queried with the to() method to get
 * shortest path to a vertex in linear time
 *
 * Sort the vertexes in topological order. Relax each of them.
 */
module.exports = function(graph, source) {

    var edge_to_source = {};
    var distance_to_source = {};

    var vertexes_count = graph.getVertexesCount();
    for (var i=0; i<vertexes_count; i++) {
        distance_to_source[i] = Number.POSITIVE_INFINITY;
    }
    distance_to_source[source] = 0;

    var topological_sort = TopologicalSort(graph);

    function relax(edge) {
        var from = edge.from();
        var to = edge.to();
        var candidate_distance = distance_to_source[from] + edge.weight;
        if (distance_to_source[to] > candidate_distance) {
            distance_to_source[to] = candidate_distance;
            edge_to_source[to] = from;
        }
    }

    var next;

    while (topological_sort.length) {
        next = topological_sort.shift();
        var adjacents = graph.getAdjacents(next);
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