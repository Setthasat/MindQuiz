import { Room } from "../models/room.model";
import { Request, Response } from "express";
import { BaseResponse } from "../utils/baseresponse.utils";
import { v4 as uuidv4 } from "uuid";
import { isValidString } from "../utils/auth.utils";

export class RoomAPI {
        createRoom = async (req: Request, res: Response) => {
            const baseResponseInst = new BaseResponse();
            const { userId, roomName } = req.body;
    
            if (!isValidString(roomName, 1, 100)) {
                baseResponseInst.setValue(400, "Invalid room name", null);
                return res.status(400).json(baseResponseInst.buildResponse());
            }
    
            try {
                const room = await Room.create({
                    roomId: uuidv4(),
                    roomName,
                    ownerId: userId,
                    members: [userId],
                });
    
                baseResponseInst.setValue(201, "Room created successfully", room);
                return res.status(201).json(baseResponseInst.buildResponse());
    
            } catch (error) {
                console.error("Room creation error:", error);
                baseResponseInst.setValue(500, "Internal Server Error", null);
                return res.status(500).json(baseResponseInst.buildResponse());
            }
        };
    
        getRoom = async (req: Request, res: Response) => {
            const baseResponseInst = new BaseResponse();
            const { roomId } = req.params;
    
            try {
                const room = await Room.findOne({ roomId });
                if (!room) {
                    baseResponseInst.setValue(404, "Room not found", null);
                    return res.status(404).json(baseResponseInst.buildResponse());
                }
    
                baseResponseInst.setValue(200, "Room retrieved successfully", room);
                return res.status(200).json(baseResponseInst.buildResponse());
    
            } catch (error) {
                console.error("Get room error:", error);
                baseResponseInst.setValue(500, "Internal Server Error", null);
                return res.status(500).json(baseResponseInst.buildResponse());
            }
        };
    
        joinRoom = async (req: Request, res: Response) => {
            const baseResponseInst = new BaseResponse();
            const { userId, roomId } = req.body;
    
            try {
                const room = await Room.findOne({ roomId });
                if (!room) {
                    baseResponseInst.setValue(404, "Room not found", null);
                    return res.status(404).json(baseResponseInst.buildResponse());
                }
    
                if (room.members.includes(userId)) {
                    baseResponseInst.setValue(400, "User already in room", null);
                    return res.status(400).json(baseResponseInst.buildResponse());
                }
    
                room.members.push(userId);
                await room.save();
    
                baseResponseInst.setValue(200, "User joined room successfully", room);
                return res.status(200).json(baseResponseInst.buildResponse());
    
            } catch (error) {
                console.error("Join room error:", error);
                baseResponseInst.setValue(500, "Internal Server Error", null);
                return res.status(500).json(baseResponseInst.buildResponse());
            }
        };
    
        leaveRoom = async (req: Request, res: Response) => {
            const baseResponseInst = new BaseResponse();
            const { userId, roomId } = req.body;
    
            try {
                const room = await Room.findOne({ roomId });
                if (!room) {
                    baseResponseInst.setValue(404, "Room not found", null);
                    return res.status(404).json(baseResponseInst.buildResponse());
                }
    
                if (!room.members.includes(userId)) {
                    baseResponseInst.setValue(400, "User not in room", null);
                    return res.status(400).json(baseResponseInst.buildResponse());
                }
    
                room.members = room.members.filter(id => id !== userId);
                await room.save();
    
                baseResponseInst.setValue(200, "User left room successfully", room);
                return res.status(200).json(baseResponseInst.buildResponse());
    
            } catch (error) {
                console.error("Leave room error:", error);
                baseResponseInst.setValue(500, "Internal Server Error", null);
                return res.status(500).json(baseResponseInst.buildResponse());
            }
        };
    
        deleteRoom = async (req: Request, res: Response) => {
            const baseResponseInst = new BaseResponse();
            const { roomId } = req.body;
    
            try {
                const room = await Room.findOne({ roomId });
                if (!room) {
                    baseResponseInst.setValue(404, "Room not found", null);
                    return res.status(404).json(baseResponseInst.buildResponse());
                }
    
                await Room.deleteOne({ roomId });
                baseResponseInst.setValue(200, "Room deleted successfully", null);
                return res.status(200).json(baseResponseInst.buildResponse());
    
            } catch (error) {
                console.error("Delete room error:", error);
                baseResponseInst.setValue(500, "Internal Server Error", null);
                return res.status(500).json(baseResponseInst.buildResponse());
            }
        };
    
}