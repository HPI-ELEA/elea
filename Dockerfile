FROM golang as compiler
COPY webserver.go .
RUN CGO_ENABLED=0 go build -o /go/bin/webserver 

FROM scratch
COPY --from=compiler /go/bin/webserver /app/webserver
COPY static /app/static
WORKDIR /app
EXPOSE 8080
CMD ["./webserver"]