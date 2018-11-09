# ipfs-s3-backed

An example of s3 backed IPFS

- uses S3 as backend storage
- Web UI [http://127.0.0.1:5002/webui](http://127.0.0.1:5002/webui)
- Support api gateway PORT `9090`

## prerequisite

create an `.env` file, see `.env.sample`

```env
AWS_ACCESSKEY=<AWS_ACCESSKEY>
AWS_SECRET_ACCESSKEY=<AWS_SECRET_ACCESSKEY>
```

## run locally

```bash
npm i
npm run dev
```

## run on container

```bash
docker-compose up
```

### References

- [js-ipfs](https://github.com/ipfs/js-ipfs)
- [js-datastore-s3](https://github.com/ipfs/js-datastore-s3)
