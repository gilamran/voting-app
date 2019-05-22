package main

import (
	"bytes"

	"github.com/orbs-network/orbs-contract-sdk/go/sdk/v1"
	"github.com/orbs-network/orbs-contract-sdk/go/sdk/v1/address"
	"github.com/orbs-network/orbs-contract-sdk/go/sdk/v1/state"
)

var PUBLIC = sdk.Export(
	getOwner,
)
var SYSTEM = sdk.Export(_init)

func _init() {
	state.WriteBytes(_formatOwnerKey(), address.GetOwnAddress())
}

/***
 * owner
 */
func _formatOwnerKey() []byte {
	return []byte("_Owner_")
}

func getOwner() []byte {
	return state.ReadBytes(_formatOwnerKey())
}

func isOwner(address []byte) bool {
	return bytes.Compare(address, getOwner()) == 0
}
