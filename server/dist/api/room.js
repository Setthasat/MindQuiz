"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomAPI = void 0;
const room_model_1 = require("../models/room.model");
const baseresponse_utils_1 = require("../utils/baseresponse.utils");
const uuid_1 = require("uuid");
const auth_utils_1 = require("../utils/auth.utils");
class RoomAPI {
    constructor() {
        this.createRoom = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const baseResponseInst = new baseresponse_utils_1.BaseResponse();
            const { userId, roomName } = req.body;
            if (!(0, auth_utils_1.isValidString)(roomName, 1, 100)) {
                baseResponseInst.setValue(400, "Invalid room name", null);
                return res.status(400).json(baseResponseInst.buildResponse());
            }
            try {
                const room = yield room_model_1.Room.create({
                    roomId: (0, uuid_1.v4)(),
                    roomName,
                    ownerId: userId,
                    members: [userId],
                });
                baseResponseInst.setValue(201, "Room created successfully", room);
                return res.status(201).json(baseResponseInst.buildResponse());
            }
            catch (error) {
                console.error("Room creation error:", error);
                baseResponseInst.setValue(500, "Internal Server Error", null);
                return res.status(500).json(baseResponseInst.buildResponse());
            }
        });
        this.getRoom = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const baseResponseInst = new baseresponse_utils_1.BaseResponse();
            const { roomId } = req.body;
            try {
                const room = yield room_model_1.Room.findOne({ roomId });
                if (!room) {
                    baseResponseInst.setValue(404, "Room not found", null);
                    return res.status(404).json(baseResponseInst.buildResponse());
                }
                baseResponseInst.setValue(200, "Room retrieved successfully", room);
                return res.status(200).json(baseResponseInst.buildResponse());
            }
            catch (error) {
                console.error("Get room error:", error);
                baseResponseInst.setValue(500, "Internal Server Error", null);
                return res.status(500).json(baseResponseInst.buildResponse());
            }
        });
        this.joinRoom = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const baseResponseInst = new baseresponse_utils_1.BaseResponse();
            const { userId, roomId } = req.body;
            try {
                const room = yield room_model_1.Room.findOne({ roomId });
                if (!room) {
                    baseResponseInst.setValue(404, "Room not found", null);
                    return res.status(404).json(baseResponseInst.buildResponse());
                }
                if (room.members.includes(userId)) {
                    baseResponseInst.setValue(400, "User already in room", null);
                    return res.status(400).json(baseResponseInst.buildResponse());
                }
                room.members.push(userId);
                yield room.save();
                baseResponseInst.setValue(200, "User joined room successfully", room);
                return res.status(200).json(baseResponseInst.buildResponse());
            }
            catch (error) {
                console.error("Join room error:", error);
                baseResponseInst.setValue(500, "Internal Server Error", null);
                return res.status(500).json(baseResponseInst.buildResponse());
            }
        });
        this.leaveRoom = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const baseResponseInst = new baseresponse_utils_1.BaseResponse();
            const { userId, roomId } = req.body;
            try {
                const room = yield room_model_1.Room.findOne({ roomId });
                if (!room) {
                    baseResponseInst.setValue(404, "Room not found", null);
                    return res.status(404).json(baseResponseInst.buildResponse());
                }
                if (!room.members.includes(userId)) {
                    baseResponseInst.setValue(400, "User not in room", null);
                    return res.status(400).json(baseResponseInst.buildResponse());
                }
                room.members = room.members.filter(id => id !== userId);
                yield room.save();
                baseResponseInst.setValue(200, "User left room successfully", room);
                return res.status(200).json(baseResponseInst.buildResponse());
            }
            catch (error) {
                console.error("Leave room error:", error);
                baseResponseInst.setValue(500, "Internal Server Error", null);
                return res.status(500).json(baseResponseInst.buildResponse());
            }
        });
        this.deleteRoom = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const baseResponseInst = new baseresponse_utils_1.BaseResponse();
            const { roomId } = req.body;
            try {
                const room = yield room_model_1.Room.findOne({ roomId });
                if (!room) {
                    baseResponseInst.setValue(404, "Room not found", null);
                    return res.status(404).json(baseResponseInst.buildResponse());
                }
                yield room_model_1.Room.deleteOne({ roomId });
                baseResponseInst.setValue(200, "Room deleted successfully", null);
                return res.status(200).json(baseResponseInst.buildResponse());
            }
            catch (error) {
                console.error("Delete room error:", error);
                baseResponseInst.setValue(500, "Internal Server Error", null);
                return res.status(500).json(baseResponseInst.buildResponse());
            }
        });
        this.getUserRooms = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const baseResponseInst = new baseresponse_utils_1.BaseResponse();
            const { userId } = req.body;
            try {
                const ownedRooms = yield room_model_1.Room.find({ ownerId: userId }).select('roomId name createdAt members');
                const joinedRooms = yield room_model_1.Room.find({
                    members: userId,
                    ownerId: { $ne: userId }
                }).select('roomId name ownerId createdAt members');
                const roomData = {
                    ownedRooms: ownedRooms.map(room => ({
                        roomId: room.roomId,
                        name: room.name,
                        memberCount: room.members.length,
                        createdAt: room.createdAt,
                        role: 'owner'
                    })),
                    joinedRooms: joinedRooms.map(room => ({
                        roomId: room.roomId,
                        name: room.name,
                        ownerId: room.ownerId,
                        memberCount: room.members.length,
                        createdAt: room.createdAt,
                        role: 'member'
                    }))
                };
                baseResponseInst.setValue(200, "User rooms retrieved successfully", roomData);
                return res.status(200).json(baseResponseInst.buildResponse());
            }
            catch (error) {
                baseResponseInst.setValue(500, "Internal Server Error", null);
                return res.status(500).json(baseResponseInst.buildResponse());
            }
        });
        this.searchRooms = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const baseResponseInst = new baseresponse_utils_1.BaseResponse();
            const { searchTerm } = req.body;
            try {
                const rooms = yield room_model_1.Room.find({
                    $or: [
                        { roomId: { $regex: searchTerm, $options: 'i' } },
                        { name: { $regex: searchTerm, $options: 'i' } }
                    ]
                }).select('roomId name ownerId members createdAt').limit(20);
                baseResponseInst.setValue(200, "Rooms found", rooms);
                return res.status(200).json(baseResponseInst.buildResponse());
            }
            catch (error) {
                baseResponseInst.setValue(500, "Internal Server Error", null);
                return res.status(500).json(baseResponseInst.buildResponse());
            }
        });
    }
}
exports.RoomAPI = RoomAPI;
