terraform {
  required_providers {
    oci = {
      source  = "oracle/oci"
      version = "~> 5.0"
    }
  }
}

provider "oci" {
  tenancy_ocid     = var.tenancy_ocid
  user_ocid        = var.user_ocid
  fingerprint      = var.fingerprint
  private_key_path = var.private_key_path
  region           = var.region
}

variable "tenancy_ocid" {}
variable "user_ocid" {}
variable "fingerprint" {}
variable "private_key_path" {}
variable "region" { default = "ap-mumbai-1" }
variable "compartment_ocid" {}

# Virtual Cloud Network
resource "oci_core_vcn" "placementiq_vcn" {
  compartment_id = var.compartment_ocid
  display_name   = "placementiq_vcn"
  cidr_block     = "10.0.0.0/16"
}

# Subnet
resource "oci_core_subnet" "placementiq_subnet" {
  compartment_id    = var.compartment_ocid
  vcn_id            = oci_core_vcn.placementiq_vcn.id
  cidr_block        = "10.0.1.0/24"
  display_name      = "placementiq_subnet"
  route_table_id    = oci_core_vcn.placementiq_vcn.default_route_table_id
  security_list_ids = [oci_core_vcn.placementiq_vcn.default_security_list_id]
}

# Always Free ARM VM Instance (4 OCPU, 24GB RAM)
resource "oci_core_instance" "placementiq_server" {
  availability_domain = data.oci_identity_availability_domains.ads.availability_domains[0].name
  compartment_id      = var.compartment_ocid
  shape               = "VM.Standard.A1.Flex"

  shape_config {
    ocpus         = 4
    memory_in_gbs = 24
  }

  create_vnic_details {
    subnet_id        = oci_core_subnet.placementiq_subnet.id
    display_name     = "primary_vnic"
    assign_public_ip = true
  }

  source_details {
    source_type = "image"
    # Canonical Ubuntu 22.04 Minimal aarch64 image
    source_id   = "ocid1.image.oc1.ap-mumbai-1.aaaaaaaaxxxxxx" 
  }

  metadata = {
    ssh_authorized_keys = file("~/.ssh/id_rsa.pub")
    user_data           = base64encode(file("setup_docker.sh"))
  }
}

data "oci_identity_availability_domains" "ads" {
  compartment_id = var.compartment_ocid
}
